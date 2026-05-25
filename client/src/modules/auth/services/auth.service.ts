import { ISignIn } from "../types/auth.types";

import Cookies from "universal-cookie";
import { createClient } from "../../../../utils/supabase/client";

import { CookieKey } from "@modules/common/enums/CookieyKey";

const cookies = new Cookies();

class AuthService {
    async signInUser({ email, password }: ISignIn) {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({ password, email })

        cookies.set(CookieKey.ACCESS_TOKEN, data.session?.access_token)

        if (error) {
            throw new Error(error.message);
        }

        console.log(data);

        return data;
    }
}

export default new AuthService;