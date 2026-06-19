import { IUser } from '@modules/user/types/user';
import { createClient } from '@utils/supabase/server';

class UserService {
    async fetchCurrentUser(): Promise<IUser | null> {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        const { data, error } = await supabase.from('users')
            .select('*')
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    };
}

export default new UserService;
