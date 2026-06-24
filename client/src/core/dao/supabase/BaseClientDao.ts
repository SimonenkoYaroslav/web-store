'use client'
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

import { createClient } from '@core/clients/supabase/client';

export abstract class BaseClientDao<Entity> {
    protected abstract readonly table: string;

    protected unwrap<T>(response: PostgrestSingleResponse<T>): T {
        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }

    async insert<Type extends Record<string, any>>(params: Type): Promise<Entity> {
        const client = createClient();
        return this.unwrap(
            await client.from(this.table).insert(params).select<'*', Entity>('*').single(),
        );
    }

    async update<Type extends { [K in Exclude<keyof Entity, string | number | symbol>]: never; }>(
        params: Type,
        id: string,
    ): Promise<Entity> {
        const client = createClient();
        return this.unwrap(await client.from(this.table).update<Type>(params).eq('id', id).select<'*', Entity>('*').single());
    }

    async delete(id: string): Promise<void> {
        const client = createClient();
        this.unwrap(await client.from(this.table).delete().eq('id', id));
    }



    async findById(id: string): Promise<Entity> {
        const client = await createClient();
        return this.unwrap(
            await client.from(this.table).select<'*', Entity>('*').eq('id', id).single(),
        );
    }
}
