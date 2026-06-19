import { Suspense } from 'react';
import DashboardPage from '@modules/dashboard/pages/dashboard';

export default async function Dashboard() {
    return (
        <Suspense><DashboardPage /></Suspense>
    );
}
