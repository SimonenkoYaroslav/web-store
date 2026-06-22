-- Subscription support for products
--
-- Stripe-billed subscription products need a recurring billing interval plus a
-- link back to the Stripe product/price they were provisioned as.
--
-- interval mirrors the BillingInterval TS enum ('Monthly' | 'Yearly'), just as
-- public."ProductType" mirrors ProductType. Only Subscription products set it,
-- so the column is nullable (single products leave it null). "Subscription
-- requires an interval" is enforced at the app layer (yup schema + the
-- createStripeSubscription action) rather than a cross-column check, so the
-- migration is safe against any pre-existing rows.
--
-- stripe_product_id / stripe_price_id are populated server-side by the
-- createStripeSubscription action after the Stripe objects exist, so they are
-- nullable and stay null for single products and not-yet-provisioned rows.

create type public."BillingInterval" as enum ('Monthly', 'Yearly');

alter table public.products
    add column interval          public."BillingInterval",
    add column stripe_product_id text,
    add column stripe_price_id   text;

-- A Stripe product/price maps to at most one local product row. The columns are
-- nullable and Postgres allows multiple NULLs under a unique index, so single
-- and unprovisioned products are unaffected.
create unique index products_stripe_product_id_key on public.products (stripe_product_id);
create unique index products_stripe_price_id_key on public.products (stripe_price_id);

comment on column public.products.interval is 'Recurring billing interval; set only for Subscription products.';
comment on column public.products.stripe_product_id is 'Stripe Product id, set once the subscription is provisioned server-side.';
comment on column public.products.stripe_price_id is 'Stripe recurring Price id, set once the subscription is provisioned server-side.';
