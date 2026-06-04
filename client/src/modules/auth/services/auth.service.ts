import { ISignIn } from "../types/auth.types";

import { createClient } from "@utils/supabase/client";

class AuthService {
    async signInUser({ email, password }: ISignIn) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({ password, email });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async signOut() {
        const supabase = createClient();

        await supabase.auth.signOut();
    }
}

export default new AuthService;