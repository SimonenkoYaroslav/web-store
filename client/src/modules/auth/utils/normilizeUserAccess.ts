import { AccessType } from "../enums/AccessType";


const normalizeUserAccess = (access?: AccessType | AccessType[]): AccessType[] => {
    if (!access) {
        return [];
    }

    if (Array.isArray(access)) {
        return access;
    }

    return [access];
}

export default normalizeUserAccess;   