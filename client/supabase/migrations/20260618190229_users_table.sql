-- Users table
--
-- Mirrors the auth.users entity: public.users.id is both the primary key and a
-- foreign key to auth.users(id), so a profile row shares the id of its auth user
-- (users.id = auth.users.id). Column names are quoted to preserve the camelCase
-- shape consumed by the IUser interface (firstName, lastName). The role column
-- uses the existing public."UserRole" enum ('Admin' | 'User').

create table public.users (
    id          uuid              primary key references auth.users (id) on delete cascade,
    email       text              not null unique,
    "firstName" text              not null,
    "lastName"  text              not null,
    avatar      text              not null default '',
    role        public."UserRole" not null default 'User',
    created_at  timestamptz       not null default now(),
    updated_at  timestamptz       not null default now()
);

comment on table public.users is 'Application user profiles, keyed by auth.users.id.';

-- Row Level Security: every user may read and update only their own profile.
alter table public.users enable row level security;

create policy "Users can view their own profile"
    on public.users
    for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Keep updated_at in sync on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


-- Provision a profile row automatically when a new auth user is created,
-- sourcing optional fields from the auth user_metadata payload.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.users (id, email, "firstName", "lastName", avatar, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'firstName', ''),
        coalesce(new.raw_user_meta_data ->> 'lastName', ''),
        coalesce(new.raw_user_meta_data ->> 'avatar', ''),
        coalesce(new.raw_user_meta_data ->> 'role', 'User')::public."UserRole"
    );
    return new;
end;
$$;
