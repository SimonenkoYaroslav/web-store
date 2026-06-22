import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// Base for entity Data Access Objects (DAO). A DAO owns all knowledge of how a
// single table is queried — its name, column shape, and filters — and returns
// domain entities, so services never touch the Supabase query builder directly.
//
// The Supabase client is passed in per call rather than stored, so one stateless
// DAO singleton serves both the browser ('use client') and server (Server
// Component / Route Handler) execution contexts. The caller picks the matching
// client (see "Service pattern" in AGENTS.md); the DAO stays context-agnostic.
export abstract class AbstractDao {
    protected abstract readonly table: string;

    // Unwraps a Supabase response: throws a plain Error on failure, otherwise
    // returns the data. Centralizes the repeated error check so concrete DAO
    // methods read as plain query definitions.
    protected unwrap<T>(response: PostgrestSingleResponse<T>): T {
        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }
}
