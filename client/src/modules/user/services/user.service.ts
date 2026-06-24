import { createClient } from '@core/clients/supabase/server';
import { userDao } from '@modules/user/dao';
import { IUser } from '@modules/user/types/user';

class UserService {
    async fetchCurrentUser(): Promise<IUser | null> {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        return userDao.findById(user.id);
    };
}

export default new UserService;
