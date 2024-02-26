import type { SinglePage } from "@/types/pages-and-stuff";
import type { PageServerLoad } from "./$types";
import { dummyPages } from "@/dev/dummyPages";

export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let status = url.searchParams.get('status')
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'

    console.log('page', page, 'status', status, 'limit', limit, 'sort', sort)



    return {
        now: new Date().toISOString(),
        total: dummyPages.length,
        totalPages: Math.ceil(dummyPages.length / limit),
        page,
        items: dummyPages,

    }


};