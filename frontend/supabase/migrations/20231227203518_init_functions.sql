-- Supabase rpc function to check if user has email. 
create or replace function get_user_id_by_email(user_email text) returns uuid
as $$
  declare
  user_id uuid;
begin
  select id 
  from auth.users 
  where email = user_email 
  into user_id;

  return user_id;
end;
$$ language plpgsql security invoker;

do
$$
declare
    pg_role record;
begin
  for pg_role in select rolname from pg_roles
    loop 
      execute 'revoke all on function "public"."get_user_id_by_email" from ' || quote_ident(pg_role.rolname);
    end loop;
  grant EXECUTE ON function "public"."get_user_id_by_email" to service_role;
end;
$$



