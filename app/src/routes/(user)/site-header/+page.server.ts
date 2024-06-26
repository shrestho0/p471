import dbTables from "@/utils/db-tables";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { AppLinks } from "@/utils/app-links";

export const load: PageServerLoad = async ({ locals }) => {
    const siteHeader = await locals.pb.collection(dbTables.header).getFirstListItem(`user = "${locals?.user?.id}"`)

    return {
        siteHeader: structuredClone(siteHeader)
    }
};


export const actions: Actions = {
    changeTitle: async ({ locals, request }) => {
        // if (!locals.user) return redirect(307, AppLinks.USER_LOGIN)

        const { siteHeaderId, site_title } = Object.fromEntries(await request.formData()) as {
            siteHeaderId: string,
            site_title: string
        };

        console.log(siteHeaderId, site_title)

        if (!siteHeaderId || !site_title) return fail(403, { message: "Invalid request" })


        const currentHeader = await locals.pb.collection(dbTables.header).getOne(siteHeaderId).catch((err) => {
            console.log("Site header could not be fetched", err)
            return null
        })

        if (!currentHeader) return fail(404, { message: "Site header not found" })

        // can be updated once in five minutes
        console.log("Current Header", currentHeader)

        if (limitUpdate(currentHeader.updated)) return fail(403, { message: "Site title can be updated once in 5 minutes" });


        const updatedHeader = await locals.pb.collection(dbTables.header).update(siteHeaderId, { site_title }).catch((err) => {
            console.log("Site title could not be updated", err)
            return null
        })

        console.log("Updated Header", updatedHeader)

        return {
            message: "Site title updated",
        }

    },

    removeLogo: async ({ locals, request }) => {
        const { siteHeaderId } = Object.fromEntries(await request.formData()) as {
            siteHeaderId: string,
        };

        const updatedHeader = await locals.pb.collection(dbTables.header).update(siteHeaderId, { logo: null }).catch((err) => {
            console.log("Logo could not be removed", err)
            return null
        })

        if (!updatedHeader) return fail(500, { message: "Logo could not be removed" })

        return {
            message: "Logo removed",
        }
    },

    changeLogo: async ({ locals, request }) => {
        const formData = await request.formData()

        console.log(formData)

        const updatedHeader = await locals.pb.collection(dbTables.header).update(formData.get('siteHeaderId') as string, formData).catch((err) => {
            console.log("Logo could not be updated", err)
            return null
        })

        if (!updatedHeader) return fail(500, { message: "Logo could not be updated" })

        return {
            message: "Logo updated",
            logo: updatedHeader.logo
        }
    },
    changeNavLinks: async ({ locals, request }) => {
        const formData = await request.formData()

        const updatedHeader = await locals.pb.collection(dbTables.header).update(formData.get('siteHeaderId') as string, formData).catch((err) => {
            console.log("Nav links could not be updated", err)
            return null
        })

        if (!updatedHeader) return fail(500, { message: "Nav links could not be updated" })

        return {
            message: "Nav links updated",
        }

    }

};

function limitUpdate(updateString: string) {
    const updated = new Date(updateString)
    const diff = (new Date()).getTime() - updated.getTime()
    const time = 5 * 60 * 1000 // 5 minutes
    return diff <= time
}

