
-- Enable Row-Level Security
ALTER TABLE public.document_sections ENABLE ROW LEVEL SECURITY;

-- Create a policy for SELECT: Users can only see their own documents
CREATE POLICY select_own_documents ON public.document_sections
    FOR SELECT USING (user_id = auth.uid());

-- Create a policy for INSERT: Users can only insert documents with their own user_id
CREATE POLICY insert_own_documents ON public.document_sections
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create a policy for UPDATE: Users can only update their own documents
CREATE POLICY update_own_documents ON public.document_sections
    FOR UPDATE USING (user_id = auth.uid());

-- Create a policy for DELETE: Users can only delete their own documents
CREATE POLICY delete_own_documents ON public.document_sections
    FOR DELETE USING (user_id = auth.uid());
