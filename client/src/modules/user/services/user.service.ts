import { userDao } from '@modules/user/dao';
import { IUser } from '@modules/user/types/user';
import { createClient } from '@utils/supabase/server';

class UserService {
    async fetchCurrentUser(): Promise<IUser | null> {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        return userDao.findById(supabase, user.id);
    };
}

export default new UserService;
