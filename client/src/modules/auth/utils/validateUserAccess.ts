import { UserRole } from "@modules/user/enums/UserRole";

import { AccessType } from "../enums/AccessType";

const validateUserAccess = (userRole: UserRole, allowedAccess: AccessType[]): boolean => {
    if (allowedAccess.length === 0) {
        return true;
    }

    return allowedAccess.includes(userRole as unknown as AccessType);
}

export default validateUserAccess;
