import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ErrorMessages } from "@/utils/messages";
import { setPBSiteKey } from "@/utils/index.server";
import { AppLinks } from "@/utils/app-links";
import DBTables from "@/utils/db-tables";

export const load: PageServerLoad = async ({ locals, parent }) => {
    if (locals.user) {
        return redirect(302, AppLinks.USER_DASHBOARD);
    }

    if (locals.admin) {
        return redirect(302, AppLinks.ADMIN_ROUTER);
    }

};


export const actions: Actions = {
    default: async ({ locals, request }) => {
        const { email, password } = Object.fromEntries(await request.formData()) as {
            email: string;
            password: string;
        };

        // // @request.headers.x_site_key="01HPV38C41AYV5KA6BGJJEWHBK"
        // console.log(email, password); // DEBUG, this is illigal :3 :D

        if (!email || !password) return fail(400, { message: ErrorMessages.ALL_FIELDS_REQUIRED });

        setPBSiteKey(locals.pb); // To tell pb that this is from web app

        // Check if email exists in database
        const userWithEmail = await locals.pb.collection(DBTables.users).getFirstListItem(`email = "${email}"`).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        if (!userWithEmail) {
            return fail(400, { message: ErrorMessages.EMAIL_NOT_FOUND })
        }

        const authUser = await locals.pb.collection(DBTables.users).authWithPassword(email, password).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        if (!authUser) {
            return fail(400, { message: ErrorMessages.PASSWORD_INCORRECT })
        }




        // Everthing should be fine here
        // return {
        //     message: "Logged in successfully",
        // }
        return redirect(302, AppLinks.USER_DASHBOARD);




    }
};