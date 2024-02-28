import dbTables from "@/utils/db-tables";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
    const siteStyle = await locals.pb.collection(dbTables.style).getFirstListItem(`user = "${locals?.user?.id}"`)

    return {
        siteStyle: structuredClone(siteStyle)
    }
};


export const actions: Actions = {
    changeFont: async ({ locals, request }) => {
        const { fontFamily, styleId, fontLoadUrl } = Object.fromEntries(await request.formData());

        const updatedStyle = await locals.pb.collection(dbTables.style).update(styleId as string, {
            fontFamily,
            fontLoadUrl
        }).catch(err => {
            console.error("Error updating style", err);
            return null;
        });

        if (!updatedStyle) {
            return fail(400, { message: "Error updating style" })
        }
        return {
            message: "Font Updated",
        }
    },

    changeStyle: async ({ locals, request }) => {
        const { styleId, styleJson } = Object.fromEntries(await request.formData());

        const updatedStyle = await locals.pb.collection(dbTables.style).update(styleId as string, {
            styleJson: JSON.parse(styleJson as string)
        }).catch(err => {
            console.error("Error updating style", err);
            return null;
        });

        if (!updatedStyle) {
            return fail(400, { message: "Error updating style" })
        }
        return {
            message: "Style Updated",
        }
    }


};