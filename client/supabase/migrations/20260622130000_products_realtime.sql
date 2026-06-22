-- Enable Supabase Realtime for the products table
--
-- Realtime "postgres_changes" only streams a table's row changes to subscribed
-- clients if the table belongs to the supabase_realtime publication. The
-- catalog page subscribes to INSERT/UPDATE/DELETE on public.products so a newly
-- created product appears live — without a page refresh — right after an admin
-- adds it from the dashboard.
--
-- Note the product create flow is multi-step (insert with an empty image_url,
-- then update once the image upload finishes), so UPDATE delivery matters as
-- much as INSERT: the catalog card fills in its image from the follow-up event.
--
-- RLS still governs realtime delivery: the existing
-- "Products are viewable by everyone" select policy (anon + authenticated)
-- decides who receives the change events, so no extra policy is needed.

alter publication supabase_realtime add table public.products;
