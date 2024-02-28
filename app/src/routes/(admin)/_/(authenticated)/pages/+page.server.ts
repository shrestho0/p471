import type { SinglePage } from "@/types/pages-and-stuff";
import type { Actions, PageServerLoad } from "./$types";
import { dummyPages } from "@/dev/dummyPages";
import dbTables from "@/utils/db-tables";
import { fail } from "@sveltejs/kit";
import type { Record } from "pocketbase";
import { setPBSiteKey } from "@/utils/index.server";

export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let status = url.searchParams.get('status') || 'all'
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'
    let q = url.searchParams.get('q')?.trim()?.toLowerCase() || ''
    let qu = url.searchParams.get('qu')?.trim()?.toLowerCase() || ''




    let filter = '';
    // if (qu) {
    //     filter += `(user.id~"${qu}" || user.username~"${qu}" || user.email~"${qu}" || user.name~"${qu}")`
    // }

    // if (q) {
    //     q = q.toLowerCase()
    //     if (q) filter += " &&"
    //     filter += `( id~"${q}" ||  title~"${q}" || content~"${q}" || slug~"${q}" ) `
    // }


    // if (qu) {
    //     filter += ` ${filter ? ' && ' : ''} ( user.id~"${q}" || user.username~"${q}" || user.email~"${q}" || user.name~"${q}") `
    // }

    if (q && qu) {
        filter = ` (id~"${q}" || title~"${q}" || content~"${q}" || slug~"${q}") && (user.id~"${qu}" || user.username~"${qu}" || user.email~"${qu}" || user.name~"${qu}")`
    } else if (q) {
        filter = ` (id~"${q}" || title~"${q}" || content~"${q}" || slug~"${q}")`
    } else if (qu) {
        filter = ` (user.id~"${qu}" || user.username~"${qu}" || user.email~"${qu}" || user.name~"${qu}")`
    }


    if (status && status != 'all') {
        if (filter) filter += ' &&'
        filter += `(status = "${status}")`
    }

    // if (status && status != 'all') {
    //     filter += `${filter ? '&&' : ''} (status = "${status})"`
    // }

    // setPBSiteKey(locals.pb)
    const pages = await locals.pb.collection(dbTables.pages).getList(page, limit, {
        filter: filter,
        sort: sort,
        expand: "user"
    }).catch((error) => {
        console.error("Error while getting pages", error);
        null;
    }) as unknown as Record;

    console.log("pages", pages, filter, sort, limit, page, status, q, qu)
    return structuredClone(pages)


};

export const actions: Actions = {
    deletePage: async ({ locals, request }) => {

        const { pageId } = Object.fromEntries(await request.formData())

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
    updateStatus: async ({ locals, request }) => {
        const { pageId, status } = Object.fromEntries(await request.formData())

        const page = await locals.pb.collection(dbTables.pages).update(pageId as string, {
            status: status
        }).catch((error) => {
            // console.error("Error while getting page", error)
            return null
        })

        if (!page) {
            return fail(403, {
                message: "Failed to ban/unban page."
            })
        }

        return {
            success: true,
            message: `Page ${status == 'banned' ? 'banned' : 'unbanned'} successfully`
        }
    }
};