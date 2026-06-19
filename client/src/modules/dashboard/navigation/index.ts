import DashboardIcon from '@mui/icons-material/Dashboard'

import { INavItem } from '@common/types'
import { AccessType } from '@modules/auth/enums/AccessType'

export const dashboardNavItems: INavItem[] = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
        access: AccessType.ADMIN,
    },
]
