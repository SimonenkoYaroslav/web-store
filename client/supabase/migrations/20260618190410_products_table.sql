-- Products table
--
-- Mirrors the IProduct interface (snake_case columns: image_url, created_at).
-- The type column uses a public."ProductType" enum whose values match the
-- ProductType TS enum ('Subscription' | 'Single'). amount is stored as
-- numeric(12, 2) to hold a money value; currency keeps the ISO-style code.

create table public.products (
    id         uuid                primary key default gen_random_uuid(),
    name       text                not null,
    image_url  text                not null default '',
    amount     numeric(12, 2)      not null check (amount >= 0),
    currency   text                not null,
    type       public."ProductType" not null,
    created_at timestamptz         not null default now()
);

comment on table public.products is 'Store products, mirroring the IProduct interface.';

-- Row Level Security: the catalog is public to read, but only authenticated
-- users may create, update or delete products.
alter table public.products enable row level security;

create policy "Products are viewable by everyone"
    on public.products
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can insert products"
    on public.products
    for insert
    to authenticated
    with check (true);

create policy "Authenticated users can update products"
    on public.products
    for update
    to authenticated
    using (true)
    with check (true);

create policy "Authenticated users can delete products"
    on public.products
    for delete
    to authenticated
    using (true);
