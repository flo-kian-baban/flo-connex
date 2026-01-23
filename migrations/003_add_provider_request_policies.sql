-- Allow providers to insert applications (requests) where they are the provider
CREATE POLICY "Providers can submit requests" ON applications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM providers
    WHERE id = provider_id
    AND claimed_by_user_id = auth.uid()
  )
);

-- Allow providers to view applications where they are the provider (direct requests)
-- Note: Existing policy covers offers, this covers direct provider_id linkage
CREATE POLICY "Providers can view their requests" ON applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM providers
    WHERE id = provider_id
    AND claimed_by_user_id = auth.uid()
  )
);

-- Allow providers to update applications where they are the provider
CREATE POLICY "Providers can update their requests" ON applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM providers
    WHERE id = provider_id
    AND claimed_by_user_id = auth.uid()
  )
);
