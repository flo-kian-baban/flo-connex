-- Update the trigger function to reuse existing interactions
CREATE OR REPLACE FUNCTION handle_application_accepted()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_user_id UUID;
    v_existing_conversation_id UUID;
BEGIN
    -- Only run if status changed to one of the active statuses
    IF NEW.status IN ('in_progress', 'completed', 'accepted') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
        
        -- Get the provider_user_id from the offer -> provider relationship
        SELECT p.claimed_by_user_id INTO v_provider_user_id
        FROM public.offers o
        JOIN public.providers p ON o.provider_id = p.id
        WHERE o.id = NEW.offer_id;

        -- Check if conversation already exists for this pair
        SELECT id INTO v_existing_conversation_id
        FROM public.conversations
        WHERE (provider_user_id = v_provider_user_id AND creator_user_id = NEW.creator_id)
           OR (provider_user_id = NEW.creator_id AND creator_user_id = v_provider_user_id) -- Handle potential role ambiguity if any, though schema defines specific columns
        LIMIT 1;

        IF v_existing_conversation_id IS NOT NULL THEN
            -- UPDATE existing conversation to point to latest application context
            UPDATE public.conversations
            SET 
                application_id = NEW.id,
                offer_id = NEW.offer_id,
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
