
import { BaseServerDao } from '@core/dao/supabase/BaseServerDao';
import { IUser } from '@user/types/user';


class UserDao extends BaseServerDao<IUser> {
    protected readonly table = 'users';
}

export default new UserDao;
