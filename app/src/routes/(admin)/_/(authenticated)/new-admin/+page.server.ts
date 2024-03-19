import { ErrorMessages } from "@/utils/messages";
import { validRegex } from "@/utils/validations";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData()) as {
            email: string,
            password: string,
            passwordConfirm: string,
        }
        console.log("received", data)

        if (!data.email || !data.password || !data.passwordConfirm) return fail(400, { message: ErrorMessages.ALL_FIELDS_REQUIRED });


        if (!validRegex.email.test(data.email)) {

            return fail(400, { message: ErrorMessages.EMAIL_INVALID })
        }

        if (data.password.length < 8) {
            return fail(400, { message: ErrorMessages.PASSWORD_INVALID })
        }

        if (data.password != data.passwordConfirm) {
            return fail(400, { message: ErrorMessages.PASSWORD_MISMATCH })
        }

        const existingAdmin = await locals.pb.admins.getFirstListItem(`email = "${data.email}"`).catch((err) => {
            return null;
        })

        if (existingAdmin != null) {
            return fail(400, { message: 'Admin with email already exists' })
        }

        const newAdmin = await locals.pb.admins.create(data).catch((err) => {
            return null
        })

        if (newAdmin) {
            return { message: 'Admin Created Successfully' }
        }

        return fail(500, { message: 'Some error occured' })


    }
};