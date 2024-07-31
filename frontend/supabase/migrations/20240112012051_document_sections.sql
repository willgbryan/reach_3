create extension if not exists vector with schema extensions;

create table
  public.document_sections (
    id uuid not null default gen_random_uuid (),
    user_id uuid null default auth.uid (),
    created_at timestamp with time zone not null default current_timestamp,
    updated_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    deleted_at timestamp without time zone null,
    content text null,
    metadata jsonb null,
    embedding vector(1536),
    name text null,
    document_set_id uuid null,
    constraint document_sections_pkey primary key (id),
    constraint document_sections_document_set_id_fkey foreign key (document_set_id) references document_set (id)
  ) tablespace pg_default;

