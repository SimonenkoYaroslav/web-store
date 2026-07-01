import { createClient } from '@core/clients/supabase/server';
import { IUser } from '@modules/user/types/user';

class UserService {
    async fetchCurrentUser(): Promise<IUser | null> {
        const client = await createClient();
        const { data: { user }, error: authError } = await client.auth.getUser();

        if (authError || !user) {
            return null;
        }

        const { data } = await client.from('users').select<'*', IUser>('*').eq('id', user.id).single();
        return data;
    };
}

export default new UserService;
