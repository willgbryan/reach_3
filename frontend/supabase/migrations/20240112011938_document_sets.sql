create table
  public.document_set (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    title text not null,
    description text null,
    created_at timestamp with time zone not null default current_timestamp,
    updated_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    private boolean not null default true,
    constraint document_set_pkey primary key (id),
    constraint document_set_user_id_fkey foreign key (user_id) references "users" (id) on update cascade on delete restrict
  ) tablespace pg_default;