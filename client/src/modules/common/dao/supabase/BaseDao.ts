import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

import { SortOrder } from '@modules/common/enums/SortOrder';
import { IGetPaginatedData } from '@modules/common/types/paginatedData';

/**
 * Resolves the Supabase client for the caller's execution context. Server code
 * injects the cookie-aware server factory; client code injects the browser one.
 */
export type SupabaseClientFactory = () => SupabaseClient | Promise<SupabaseClient>;

/**
 * Single, context-neutral data-access base — the only layer that speaks Supabase.
 * Swap Supabase here (and the @core/clients factories) and every entity DAO follows.
 *
 * The server and browser clients cannot live in one module: the server client
 * imports `next/headers`, which Next.js forbids in any module reachable from a
 * Client Component — even through a dynamic `import()`, which Turbopack still
 * traces into the client bundle. So this layer never imports a client at all.
 * Instead the context-specific factory is injected by the (already split) service
 * layer, keeping one base DAO and one entity DAO with no duplicated query logic.
 */
export abstract class BaseDao<Entity> {
    protected abstract readonly table: string;

    constructor(protected readonly getClient: SupabaseClientFactory) {}

    protected unwrap<T>(response: PostgrestSingleResponse<T>): T {
        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }

    async findById(id: string): Promise<Entity> {
        const client = await this.getClient();
        return this.unwrap(
            await client.from(this.table).select<'*', Entity>('*').eq('id', id).single(),
        );
    }

    async insert<Type extends object>(params: Type): Promise<Entity> {
        const client = await this.getClient();
        return this.unwrap(
            await client.from(this.table).insert(params).select<'*', Entity>('*').single(),
        );
    }

    async update<Type extends { [K in Exclude<keyof Entity, string | number | symbol>]: never; }>(
        params: Type,
        id: string,
    ): Promise<Entity> {
        const client = await this.getClient();
        return this.unwrap(
            await client.from(this.table).update<Type>(params).eq('id', id).select<'*', Entity>('*').single(),
        );
    }

    async findAll(params: IGetPaginatedData<Entity>): Promise<Entity[]> {
        const { sortBy, sortOrder = SortOrder.DESC } = params;

        const client = await this.getClient();
        return this.unwrap(
            await client
                .from(this.table)
                .select<'*', Entity>('*')
                .order(sortBy, { ascending: sortOrder === SortOrder.ASC }),
        );
    }

    async delete(id: string): Promise<void> {
        const client = await this.getClient();
        this.unwrap(await client.from(this.table).delete().eq('id', id));
    }
}
