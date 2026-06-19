import { Skeleton, TableSkeleton } from '@components';

export default function DashboardLoading() {
    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-9 w-28" />
            </div>
            <TableSkeleton columns={6} rows={5} />
        </div>
    );
}
