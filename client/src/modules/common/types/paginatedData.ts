import { SortOrder } from "@modules/common/enums/SortOrder";


export interface IGetPaginatedData<Entity> {
    page: number;
    pageSize: number;
    sortBy: Extract<keyof Entity, string>
    sortOrder: SortOrder
}
