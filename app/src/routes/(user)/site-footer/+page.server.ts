import dbTables from "@/utils/db-tables";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
    const siteFooter = await locals.pb.collection(dbTables.footer).getFirstListItem(`user = "${locals?.user?.id}"`)

    return {
        siteFooter: structuredClone(siteFooter)
    }
};


export const actions: Actions = {
    changeFooterText: async ({ request, locals }) => {
        const formData = await request.formData();
        const updatedFooter = await locals.pb.collection(dbTables.footer).update(formData.get('siteFooterId') as string, formData).catch(err => {
            console.error(err);
            return null;
        });

        if (!updatedFooter) {
            return fail(400, { message: 'Failed to update footer' })
        }

        return {
            message: 'Footer updated',
        }
    },
    changeSocialLinks: async ({ locals, request }) => {
        const { social_json, siteFooterId } = Object.fromEntries(await request.formData())

        console.log("Form Data", social_json, siteFooterId)

        const updatedFooter = await locals.pb.collection(dbTables.footer).update(siteFooterId as string, {
            social_json: social_json
        }).catch((err) => {
            console.log("Social links could not be updated", err)
            return null
        })

        if (!updatedFooter) return fail(500, { message: "Social links could not be updated" })

        return {
            message: "Social links updated",
        }

    }

};