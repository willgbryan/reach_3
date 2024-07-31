-- Create the 'sources' table

create table public.sources (
  id text not null,
  content jsonb null,
  metadata jsonb null,
  created_at timestamp with time zone null default now(),
  document_hash text not null,
  constraint sources_pkey primary key (id),
  constraint sources_document_hash_key unique (document_hash)
);

-- Create the 'source_chat_map' table to link sources and chats
CREATE TABLE public.source_chat_map (
    mapping_id TEXT PRIMARY KEY,
    source_id TEXT REFERENCES public.sources(id),
    chat_id TEXT REFERENCES public.chats(id) ON DELETE CASCADE,
    messageIndex TEXT, -- Add 'messageIndex' property to the mapping
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Enable row level security on 'sources' table
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Add policy to allow read access to sources
CREATE POLICY read_sources ON public.sources
FOR SELECT
USING (TRUE);  -- Adjust this based on your application's security requirements

-- Add policy to allow insertion of new sources
CREATE POLICY insert_sources ON public.sources
FOR INSERT
WITH CHECK (TRUE);  -- Adjust this based on your application's security requirements

-- Enable row level security on 'source_chat_map' table
ALTER TABLE public.source_chat_map ENABLE ROW LEVEL SECURITY;

-- Add policy to allow read access to source_chat_map
CREATE POLICY read_source_chat_map ON public.source_chat_map
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.chats
        WHERE public.chats.id = source_chat_map.chat_id AND public.chats.user_id = auth.uid()
    )
);

-- Add policy to allow insertion into source_chat_map
CREATE POLICY insert_source_chat_map ON public.source_chat_map
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.chats
        WHERE public.chats.id = source_chat_map.chat_id AND public.chats.user_id = auth.uid()
    )
);

-- Add policy to allow deletion from source_chat_map
CREATE POLICY delete_source_chat_map ON public.source_chat_map
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.chats
        WHERE public.chats.id = source_chat_map.chat_id AND public.chats.user_id = auth.uid()
    )
);
