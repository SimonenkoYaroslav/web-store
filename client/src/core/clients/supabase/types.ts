import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientFactory = () => SupabaseClient | Promise<SupabaseClient>;
