import type { SinglePage } from "@/types/pages-and-stuff";
import type { Actions, PageServerLoad } from "./$types";
import { dummyPages } from "@/dev/dummyPages";
import dbTables from "@/utils/db-tables";
import { fail } from "@sveltejs/kit";
import type { Record } from "pocketbase";

export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let status = url.searchParams.get('status')
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'
    let q = url.searchParams.get('q')?.trim() || ''




    let filter = '';
    if (q) {
        q = q.toLowerCase()
        filter = `title~"${q}" || content~"${q}" || slug~"${q}" `
    }


    if (status && status != 'all') {
        filter += `${filter ? '&&' : ''} status = "${status}"`
    }

    // if (filter) {
    //     filter += ' && slug != "/"'
    // } else {
    //     filter == 'slug != "/"'
    // }

    // if (!filter) {
    //     filter = 'slug != "/"'
    // } else {
    //     filter += ' && slug != "/"'
    // }

    // console.log('filter', filter, "page", page, "limit", limit, "sort", sort, "q", q)

    const pages = await locals.pb.collection(dbTables.pages).getList(page, limit, {
        filter: filter,
        sort: sort
    }).catch((error) => {
        console.error("Error while getting pages", error);
        null;
    }) as unknown as Record;


    return structuredClone(pages)


};

export const actions: Actions = {
    deletePage: async ({ locals, request }) => {

        const { pageId } = Object.fromEntries(await request.formData())

        // check if user owns this page
        // if yes, delete page and return success
        // else any other case return success: false

        const page = await locals.pb.collection(dbTables.pages).delete(pageId as string).catch((error) => {
            // console.error("Error while getting page", error)
            return null
        })

        if (!page) {
            return fail(403, {
                message: "Failed to delete page."
            })
        }

        return {
            success: true,
            message: "Page deleted successfully"
        }
    },
};