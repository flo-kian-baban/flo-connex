-- Update the trigger function to handle direct provider-to-creator requests (where offer_id is NULL)
CREATE OR REPLACE FUNCTION handle_application_accepted()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_user_id UUID;
    v_existing_conversation_id UUID;
BEGIN
    -- Only run if status changed to one of the active statuses
    IF NEW.status IN ('in_progress', 'completed', 'accepted') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
        
        -- 1. Try to get provider_user_id via Offer (if offer exists)
        IF NEW.offer_id IS NOT NULL THEN
            SELECT p.claimed_by_user_id INTO v_provider_user_id
            FROM public.offers o
            JOIN public.providers p ON o.provider_id = p.id
            WHERE o.id = NEW.offer_id;
        END IF;

        -- 2. Fallback: If no offer (Direct Request) or lookup failed, try getting it via provider_id directly on application
        IF v_provider_user_id IS NULL AND NEW.provider_id IS NOT NULL THEN
             SELECT claimed_by_user_id INTO v_provider_user_id
             FROM public.providers
             WHERE id = NEW.provider_id;
        END IF;

        -- If we still don't have a provider user ID (e.g. data corruption), we can't create a conversation
        IF v_provider_user_id IS NULL THEN
            -- Ideally log a warning, but for now we just exit to avoid the NOT NULL violation crashing the transaction
            -- Alternatively, raise a simplified error if it's critical
            RAISE WARNING 'Could not resolve provider_user_id for application %', NEW.id;
            RETURN NEW; 
        END IF;

        -- Check if conversation already exists for this pair
        SELECT id INTO v_existing_conversation_id
        FROM public.conversations
        WHERE (provider_user_id = v_provider_user_id AND creator_user_id = NEW.creator_id)
           OR (provider_user_id = NEW.creator_id AND creator_user_id = v_provider_user_id)
        LIMIT 1;

        IF v_existing_conversation_id IS NOT NULL THEN
            -- UPDATE existing conversation to point to latest application context
            UPDATE public.conversations
            SET 
                application_id = NEW.id,
                offer_id = NEW.offer_id, -- Might be NULL for direct requests, which is fine if column allows
                updated_at = NOW()
            WHERE id = v_existing_conversation_id;
        ELSE
            -- INSERT new conversation if none exists
            INSERT INTO public.conversations (
                application_id, 
                provider_user_id, 
                creator_user_id, 
                offer_id
            ) VALUES (
                NEW.id,
                v_provider_user_id,
                NEW.creator_id,
                NEW.offer_id
            );
        END IF;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
