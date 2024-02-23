import { redirect, type Actions, fail } from "@sveltejs/kit";
import { ErrorMessages } from "@/utils/messages";
import DBTables from "@/utils/db-tables";


export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as {
            oldPassword: string,
            password: string,
            passwordConfirm: string,
        } as {
            [key: string]: string;
        };

        if (data.password.length < 8) return fail(400, { meesage: ErrorMessages.PASSWORD_INVALID })

        if (data.password != data.passwordConfirm) return fail(400, { message: ErrorMessages.PASSWORD_CONFIRM_INVALID });

        try {
            await locals.pb.collection(DBTables.users).update(locals.user.id, data);
            locals.pb.authStore.clear();
        } catch (error) {
            return fail(400, { message: "Something Unknown" });
        }

        const goto = locals?.admin ? "/_/" : "/login";
        locals.pb.authStore.clear();
        return redirect(302, goto);
    }
};