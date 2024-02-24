import { redirect, type Actions, fail } from "@sveltejs/kit";
import { ErrorMessages } from "@/utils/messages";
import DBTables from "@/utils/db-tables";

import { PB_HOST } from "$env/static/private";

import Pocketbase, { Admin, Record } from 'pocketbase';

export const actions: Actions = {
    changePassword: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as any;
        const { oldPassword, password, passwordConfirm } = data

        try {

            try {

                // check if admin entered an correct old password
                const newPb = new Pocketbase(PB_HOST);
                const adminWithOldPassword = await newPb.admins.authWithPassword(String(locals?.admin?.email), oldPassword);
                newPb.authStore.clear();

            } catch (err) {
                return fail(403, {
                    message: "Old password is incorrect"
                });
            }



            const user = await locals.pb.admins.update(locals?.admin?.id as string, {
                oldPassword,
                password,
                passwordConfirm
            })

            locals.admin = user;


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