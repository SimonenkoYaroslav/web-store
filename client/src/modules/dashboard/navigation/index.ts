import DashboardIcon from '@mui/icons-material/Dashboard'

import { INavItem } from '@common/types'
import { UserRole } from '@modules/user/enums/UserRole'

export const dashboardNavItems: INavItem[] = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
        access: UserRole.ADMIN,
    },
]
