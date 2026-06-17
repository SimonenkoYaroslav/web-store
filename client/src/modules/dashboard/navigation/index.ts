import DashboardIcon from '@mui/icons-material/Dashboard'
import { AccessType } from '@modules/auth/enums/AccessType'
import { INavItem } from '@common/types'

export const dashboardNavItems: INavItem[] = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
        access: AccessType.ADMIN,
    },
]
