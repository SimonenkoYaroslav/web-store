import { BaseDao } from '@modules/common/dao/supabase/BaseDao';
import { IUser } from '@user/types/user';

export class UserDao extends BaseDao<IUser> {
    protected readonly table = 'users';
}
