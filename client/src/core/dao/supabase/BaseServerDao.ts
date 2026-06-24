import { createClient } from "@core/clients/supabase/server";
import { SortOrder } from "@modules/common/enums/SortOrder";
import { IGetPaginatedData } from "@modules/common/types/paginatedData";
import { PostgrestSingleResponse } from "@supabase/supabase-js";


export abstract class BaseServerDao<Entity> {
    protected abstract readonly table: string;

    protected unwrap<T>(response: PostgrestSingleResponse<T>): T {
        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }

    async findAll(params: IGetPaginatedData<Entity>): Promise<Entity[]> {
        const { sortBy, sortOrder = SortOrder.DESC } = params;

        const client = await createClient();
        return this.unwrap(
            await client.from(this.table).select<'*', Entity>('*').order(sortBy, { ascending: sortOrder === SortOrder.ASC }),
        );
    }

    async findById(id: string): Promise<Entity> {
        const client = await createClient();
        return this.unwrap(
            await client.from(this.table).select<'*', Entity>('*').eq('id', id).single(),
        );
    }
}