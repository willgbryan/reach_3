create table
  public.payments (
    id text not null,
    user_id uuid not null,
    price_id text null,
    status text null,
    amount bigint null,
    currency text null,
    created timestamp with time zone not null default timezone ('utc'::text, now()),
    metadata jsonb null,
    description text null,
    constraint payments_pkey primary key (id),
    constraint payments_user_id_fkey foreign key (user_id) references auth.users (id),
    constraint payments_currency_check check ((char_length(currency) = 3))
  ) tablespace pg_default;

  -- Step 1: Enable Row Level Security on the 'payments' table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Step 2: Create Policies

-- Drop existing policies on 'payments' table to start fresh
DROP POLICY IF EXISTS all_access ON public.payments;

