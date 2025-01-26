import { encodedRedirect } from "@/utils";
import { createClient } from "@/utils/supabase/client";

export const signInAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if(error) {
        return encodedRedirect('error', '/auth/sign-in', error.message);
    }
}