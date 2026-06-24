import { ISignIn, ISignUp } from "@auth/types/auth.types";
import { createClient } from "@core/clients/supabase/client";
import { UserRole } from "@modules/user/enums/UserRole";

class AuthService {
    async signInUser({ email, password }: ISignIn) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({ password, email });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async signUpUser({ email, password, firstName, lastName }: ISignUp) {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Stored on auth.users.user_metadata — LogInForm reads `role` from here to
                // decide the post-login redirect. New accounts default to the USER role.
                data: {
                    firstName,
                    lastName,
                    role: UserRole.USER,
                },
            },
        });

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

const authService = new AuthService;
export default authService;
