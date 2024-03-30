import dbTables from "@/utils/db-tables";
import { setPBSiteKey } from "@/utils/index.server";
import { ErrorMessages } from "@/utils/messages";
import { validRegex } from "@/utils/validations";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    updateInfo: async ({ request, locals }) => {
        if (!locals?.user) {
            return fail(400, { message: 'User not found' })
        }

        const { name, username } = Object.fromEntries(await request.formData()) as Record<string, string>

        console.log(name, username)





        if (!name && !username) {
            return fail(400, { message: 'Atleast one field is must not be empty' })
        }

        const fieldErrors = {
            name: '',
            email: '',
            username: ''
        }

        if (username == locals.user.username) {
            fieldErrors.username = "This username is already set to your account"
        }


        if (name && !validRegex.name.test(name)) {
            fieldErrors.name = ErrorMessages.NAME_INVALID

            return fail(400, { fieldErrors })
        };


        const updateObj: any = {
        }

        if (name) updateObj.name = name
        if (username) updateObj.username = username


        // setPBSiteKey(locals.pb)
        // const userExistsWithEmail = await locals.pb.collection(dbTables.users).getFirstListItem(`email = "${email.trim()}"`).catch((e) => {
        //     // console.log(e); // DEBUG
        //     return null;
        // });

        // if (userExistsWithEmail) {
        //     fieldErrors.email = ErrorMessages.EMAIL_EXISTS
        // }

        setPBSiteKey(locals.pb)
        const userExistsWithUsername = await locals.pb.collection(dbTables.users).getFirstListItem(`username = "${username.trim()}"`).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        if (userExistsWithUsername) {
            fieldErrors.username = ErrorMessages.USERNAME_EXISTS
        }



        if (fieldErrors.name || fieldErrors.email || fieldErrors.username) {
            return fail(400, { fieldErrors })
        }

        if (updateObj.email) {
            updateObj.verified = false
        }

        const updatedUser = await locals.pb.collection(dbTables.users).update(locals.user.id, updateObj).catch((err) => {
            return null
        })

        if (!updatedUser) return fail(500, {
            message: 'Failed to update user'
        })

        return { message: "User updated successfully" }
    },
    verifyEmail: async ({ request, locals }) => {
        if (!locals?.user) {
            return fail(400, { message: 'Must be logged in as user' })
        }


        try {
            await locals.pb.collection(dbTables.users).requestVerification(locals.user.email)
            return { message: "Verification Email sent" }

        } catch (err) {
            console.log(err)

            return fail(400, {
                message: "Failed to send verification email"
            })
        }

    },
    changeEmail: async ({ request, locals }) => {
        const { newEmail } = Object.fromEntries(await request.formData()) as Record<string, string>


        if (!locals?.user) {
            return fail(400, { message: 'Must be logged in as user' })
        }

        // check if this is current user's email
        if (locals.user.email == newEmail) {
            return fail(400, {
                message: "Email already set to your account"
            })
        }

        setPBSiteKey(locals.pb)
        const userExistsWithEmail = await locals.pb.collection(dbTables.users).getFirstListItem(`email = "${newEmail.trim()}"`).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        if (userExistsWithEmail) {
            return fail(400, {
                message: "Email already exists"
            })
        }

        try {
            await locals.pb.collection(dbTables.users).requestEmailChange(newEmail)
            return { message: "Email change request sent" }

        } catch (err) {
            // console.log(err)
            // console.log(err?.data?.data?.message)

            return fail(400, {
                message: err?.data?.data?.newEmail?.message?.toString()
            })
        }

    },

};