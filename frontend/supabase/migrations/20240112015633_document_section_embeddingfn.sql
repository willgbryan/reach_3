drop function if exists match_documents (vector (1536), int, jsonb);

-- Recreate the function with the desired return type
create
or replace function match_documents (
  query_embedding vector (1536),
  match_count int default null,
  filter jsonb default '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
) language plpgsql as $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    metadata,
    (embedding::text)::jsonb AS embedding,
    1 - (document_sections.embedding <=> query_embedding) AS similarity
  FROM document_sections
  WHERE metadata @> filter
  ORDER BY document_sections.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


create index on document_sections using hnsw (embedding vector_cosine_ops);