import { createClient } from "../../../../utils/supabase/server";


class UserService {
    async fetchCurrentUser() {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        const { data, error } = await supabase.from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}


export default new UserService;