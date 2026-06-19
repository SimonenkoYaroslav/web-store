import type { SvgIconComponent } from '@mui/icons-material'
import { AccessType } from '@modules/auth/enums/AccessType'

export interface INavItem {
    href: string
    label: string
    icon: SvgIconComponent
    access?: AccessType | AccessType[]
}
