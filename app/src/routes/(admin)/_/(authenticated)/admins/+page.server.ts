import type { SinglePage } from "@/types/pages-and-stuff";
import type { Actions, PageServerLoad } from "./$types";
import type { User } from "@/types/users";
import dbTables from "@/utils/db-tables";
import { fail } from "@sveltejs/kit";
import { ErrorMessages } from "@/utils/messages";
import { validRegex } from "@/utils/validations";
export const load: PageServerLoad = async ({ locals, url }) => {

    const admins = await locals.pb.admins.getFullList();
    // console.log(admins)
    return {
        items: structuredClone(admins),
        totalItems: admins?.length
    }

};

export const actions: Actions = {
    deleteUser: async ({ request, locals }) => {
        const { adminId } = Object.fromEntries(await request.formData());

        if (!adminId) {
            return fail(400, { message: 'Admin Id Missing' })
        }

        try {
            const deletedUser = await locals.pb.admins.delete(adminId as string)
            return { message: 'User deleted successfully' }
        } catch (err: any) {
            console.log(err)
            return fail(500, { message: err?.message })
        }
    },
    updateUser: async ({ request, locals }) => {

        const { adminId, emailX, passwordX, oldEmail } = Object.fromEntries(await request.formData()) as {
            adminId: string,
            emailX: string,
            oldEmail: string,
            passwordX: string
        };

        if (!emailX && !passwordX) {
            return fail(400, { message: 'Nothing to update!' })
        }

        if (oldEmail == emailX) {
            return fail(400, { message: 'Old and new emails are same' })
        }

        // check if email and password valid
        if (emailX && !validRegex.email.test(emailX)) {

            return fail(400, { message: ErrorMessages.EMAIL_INVALID })
        }

        if (passwordX && passwordX.length < 8) {
            return fail(400, { message: ErrorMessages.PASSWORD_INVALID })
        }

        // check if admin already exists with the email

        const existingAdmin = await locals.pb.admins.getFirstListItem(`email = "${emailX}"`).catch((err) => {
            return null;
        })

        if (existingAdmin != null) {
            return fail(400, { message: 'Admin with email already exists' })
        }

        let updateObj: any = {}
        if (emailX) {
            updateObj.email = emailX
        }
        if (passwordX) {
            updateObj.password = passwordX;
            updateObj.passwordConfirm = passwordX;
        }

        const updatedAdmin = await locals.pb.admins.update(adminId, updateObj).catch((err) => {
            return null
        })

        console.log(updatedAdmin)

        if (updatedAdmin) {
            return { message: 'Admin Updated Successfully' }
        }

        return fail(500, { message: 'Some error occured' })

    }
};