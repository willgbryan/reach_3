-- Search index to speed up library searches once embeddings get too large

alter table
  document_sections
add column
  fts tsvector generated always as (to_tsvector('english', content || ' ' || name)) stored;

create index document_search on document_sections using gin (fts); -- generate the index