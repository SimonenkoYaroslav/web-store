import { createClient } from '@core/clients/supabase/server';
import userDao from '@modules/user/dao/user.dao';
import { IUser } from '@modules/user/types/user';

class UserService {
    async fetchCurrentUser(): Promise<IUser | null> {
        const client = await createClient();
        const { data: { user }, error: authError } = await client.auth.getUser();

        if (authError || !user) {
            return null;
        }

        try {
            return await userDao.findById(client, user.id);
        } catch {
            return null;
        }
    }
}

export default new UserService;
