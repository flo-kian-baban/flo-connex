-- Fix the ACTUAL deliverable submission notification trigger (notify_deliverable_submitted, not notify_on_deliverable_submission)
CREATE OR REPLACE FUNCTION public.notify_deliverable_submitted()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_user_id UUID;
    v_creator_name TEXT;
    v_offer_title TEXT;
    v_old_count INTEGER := 0;
    v_new_count INTEGER := 0;
BEGIN
    -- Safeguard for jsonb array counting
    IF OLD.submitted_deliverables IS NOT NULL AND jsonb_typeof(OLD.submitted_deliverables) = 'array' THEN
        v_old_count := jsonb_array_length(OLD.submitted_deliverables);
    END IF;

    IF NEW.submitted_deliverables IS NOT NULL AND jsonb_typeof(NEW.submitted_deliverables) = 'array' THEN
        v_new_count := jsonb_array_length(NEW.submitted_deliverables);
    END IF;

    -- Only notify when deliverables are newly submitted (count increased from 0)
    IF v_old_count = 0 AND v_new_count > 0 THEN
        
        -- 1. Try to get provider user ID via Offer (if offer exists)
        IF NEW.offer_id IS NOT NULL THEN
            SELECT p.claimed_by_user_id INTO v_provider_user_id
            FROM offers o
            JOIN providers p ON o.provider_id = p.id
            WHERE o.id = NEW.offer_id;
        END IF;

        -- 2. Fallback: If no offer (Direct Request), get provider_user_id via provider_id directly
        IF v_provider_user_id IS NULL AND NEW.provider_id IS NOT NULL THEN
            SELECT claimed_by_user_id INTO v_provider_user_id
            FROM providers
            WHERE id = NEW.provider_id;
        END IF;

        -- If we still don't have a provider user ID, skip notification
        IF v_provider_user_id IS NULL THEN
            RAISE WARNING 'Could not resolve provider_user_id for application % - skipping notification', NEW.id;
            RETURN NEW;
        END IF;
        
        -- Get creator name
        SELECT display_name INTO v_creator_name
        FROM creator_profiles
        WHERE user_id = NEW.creator_id;
        
        -- Get offer title (or use request title for direct requests)
        IF NEW.offer_id IS NOT NULL THEN
            SELECT title INTO v_offer_title FROM offers WHERE id = NEW.offer_id;
        ELSE
            v_offer_title := COALESCE(NEW.request_details->>'title', 'Direct Request');
        END IF;
        
        -- Create notification for provider
        INSERT INTO notifications (
            recipient_user_id,
            type,
            title,
            body,
            application_id,
            offer_id,
            metadata
        ) VALUES (
            v_provider_user_id,
            'deliverable_submitted',
            COALESCE(v_creator_name, 'A Creator') || ' submitted deliverables',
            'Review the deliverables for "' || v_offer_title || '"',
            NEW.id,
            NEW.offer_id,
            jsonb_build_object('creator_id', NEW.creator_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
