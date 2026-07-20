import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

import { SortOrder } from '@modules/common/enums/SortOrder';
import { IGetPaginatedData } from '@modules/common/types/paginatedData';

export abstract class BaseDao<Entity> {
    protected abstract readonly table: string;

    protected unwrap<T>(response: PostgrestSingleResponse<T>): T {
        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }

    async findById(client: SupabaseClient, id: string): Promise<Entity> {
        return this.unwrap(
            await client.from(this.table).select<'*', Entity>('*').eq('id', id).single(),
        );
    }

    async insert<Type extends object>(client: SupabaseClient, params: Type): Promise<Entity> {
        return this.unwrap(
            await client.from(this.table).insert(params).select<'*', Entity>('*').single(),
        );
    }

    async update(client: SupabaseClient, params: Partial<Entity>, id: string): Promise<Entity> {
        return this.unwrap(
            await client.from(this.table).update(params as never).eq('id', id).select<'*', Entity>('*').single(),
        );
    }

    async findAll(client: SupabaseClient, params: IGetPaginatedData<Entity>): Promise<Entity[]> {
        const { page, pageSize, sortBy, sortOrder = SortOrder.DESC } = params;
        const from = (page - 1) * pageSize;

        return this.unwrap(
            await client
                .from(this.table)
                .select<'*', Entity>('*')
                .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
                .range(from, from + pageSize - 1),
        );
    }

    async delete(client: SupabaseClient, id: string): Promise<void> {
        this.unwrap(await client.from(this.table).delete().eq('id', id));
    }
}
