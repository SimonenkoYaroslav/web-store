import { createClient } from "../../../../utils/supabase/server";


class UserService {
    async fetchCurrentUser(accessToken: string) {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error) {
            throw new Error(error.message);
        }

        return data.user;
    }
}


export default new UserService;