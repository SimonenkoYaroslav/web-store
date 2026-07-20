import { BaseDao } from '@modules/common/dao/supabase/BaseDao';
import { IUser } from '@user/types/user';

class UserDao extends BaseDao<IUser> {
    protected readonly table = 'users';
}

export default new UserDao();
