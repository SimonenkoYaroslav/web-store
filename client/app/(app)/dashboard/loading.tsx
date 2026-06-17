export default function DashboardLoading() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="rounded-lg overflow-hidden shadow">
                <div className="h-12 bg-gray-100" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-gray-100">
                        <div className="h-12 w-12 bg-gray-200 rounded animate-pulse shrink-0" />
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}
