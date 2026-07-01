import { INavItem } from '@common/types'
import normalizeAllowedAccess from '@modules/auth/utils/normalizeAllowedAccess'
import validateUserAccess from '@modules/auth/utils/validateUserAccess'
import rootModule from '@modules/index'
import { UserRole } from '@modules/user/enums/UserRole'

export const filterNavItemsByAccess = (role?: UserRole): INavItem[] =>
    rootModule.navigation.filter((item) => {
        const allowedAccess = normalizeAllowedAccess(item.access)

        if (allowedAccess.length === 0) {
            return true
        }

        return role !== undefined && validateUserAccess(role, allowedAccess)
    })
