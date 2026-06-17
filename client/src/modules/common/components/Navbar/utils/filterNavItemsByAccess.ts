import { catalogNavItems } from '@modules/catalog'
import { dashboardNavItems } from '@modules/dashboard'
import { UserRole } from '@modules/user/enums/UserRole'
import validateUserAccess from '@modules/auth/utils/validateUserAccess'
import { INavItem } from '@common/types'
import normalizeAllowedAccess from '@modules/auth/utils/normalizeAllowedAccess'

export const navItems: INavItem[] = [
    ...catalogNavItems,
    ...dashboardNavItems,
]

export const filterNavItemsByAccess = (role?: UserRole): INavItem[] =>
    navItems.filter((item) => {
        const allowedAccess = normalizeAllowedAccess(item.access)

        if (allowedAccess.length === 0) {
            return true
        }

        return role !== undefined && validateUserAccess(role, allowedAccess)
    })
