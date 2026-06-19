import { AccessType } from "../enums/AccessType";

const normalizeAllowedAccess = (access?: AccessType | AccessType[]): AccessType[] => {
    if (!access) {
        return [];
    }

    if (Array.isArray(access)) {
        return access;
    }

    return [access];
}

export default normalizeAllowedAccess;   
