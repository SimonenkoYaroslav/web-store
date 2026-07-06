import type { PostgrestSingleResponse } from '@supabase/supabase-js';

import { SupabaseClientFactory } from '@core/clients/supabase/types';
import { SortOrder } from '@modules/common/enums/SortOrder';
import { IGetPaginatedData } from '@modules/common/types/paginatedData';

export type { SupabaseClientFactory };

export abstract class BaseDao<Entity> {
    protected abstract readonly table: string;

    constructor(protected readonly getClient: SupabaseClientFactory) { }

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

    async update(params: Partial<Entity>, id: string): Promise<Entity> {
        const client = await this.getClient();


        return this.unwrap(
            await client.from(this.table).update(params as never).eq('id', id).select<'*', Entity>('*').single(),
        );
    }

    async findAll(params: IGetPaginatedData<Entity>): Promise<Entity[]> {
        const { page, pageSize, sortBy, sortOrder = SortOrder.DESC } = params;
        const from = (page - 1) * pageSize;

        const client = await this.getClient();
        return this.unwrap(
            await client
                .from(this.table)
                .select<'*', Entity>('*')
                .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
                .range(from, from + pageSize - 1),
        );
    }

    async delete(id: string): Promise<void> {
        const client = await this.getClient();
        this.unwrap(await client.from(this.table).delete().eq('id', id));
    }
}
