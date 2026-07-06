import { UserRole } from '@modules/user/enums/UserRole';


class AccessService {
    canAccess(role: UserRole | undefined, access?: UserRole | UserRole[]): boolean {
        const allowedAccess = this.normalizeAllowedAccess(access);

        if (allowedAccess.length === 0) {
            return true;
        }

        return role !== undefined && allowedAccess.includes(role);
    }

    private normalizeAllowedAccess(access?: UserRole | UserRole[]): UserRole[] {
        if (!access) {
            return [];
        }

        return Array.isArray(access) ? access : [access];
    }
}

export default new AccessService;
