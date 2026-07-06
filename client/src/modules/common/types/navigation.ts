import type { SvgIconComponent } from '@mui/icons-material'

import { UserRole } from '@modules/user/enums/UserRole'

export interface INavItem {
    href: string
    label: string
    icon: SvgIconComponent
    access?: UserRole | UserRole[]
}
