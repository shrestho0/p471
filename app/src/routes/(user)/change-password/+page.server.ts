import { redirect, type Actions, fail } from "@sveltejs/kit";
import { ErrorMessages } from "@/utils/messages";
import DBTables from "@/utils/db-tables";


export const actions: Actions = {
    changePassword: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData());
        const { oldPassword, password, passwordConfirm } = data

        try {
            const user = await locals.pb.collection(DBTables.users).update(locals?.user?.id as string, {
                oldPassword,
                password,
                passwordConfirm
            })

            locals.user = user;


        } catch (err: any) {
            if (err?.data?.data?.oldPassword) {
                return fail(403, {
                    message: err?.data?.data?.oldPassword?.message
                });
            }
            return fail(500, {
                message: ErrorMessages.DEFAULT_ERROR
            })
        }
    }
};