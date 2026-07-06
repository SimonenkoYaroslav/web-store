import { INavItem } from '@common/types';
import { accessService } from '@modules/auth/services';
import rootModule from '@modules/index';
import { UserRole } from '@modules/user/enums/UserRole';

/**
 * Composes the sidebar from every module's nav contributions, hiding items
 * whose `access` the given role fails (no role hides all restricted items).
 */
class NavigationService {
    filterNavItemsByAccess(role?: UserRole): INavItem[] {
        return rootModule.navigation.filter((item) => accessService.canAccess(role, item.access));
    }
}

export default new NavigationService;
