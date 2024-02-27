import type { SinglePage } from "@/types/pages-and-stuff";
import type { PageServerLoad } from "./$types";
import { dummyPages } from "@/dev/dummyPages";

export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let status = url.searchParams.get('status')
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'
    let q = url.searchParams.get('q') || ''
    let qu = url.searchParams.get('uq') || ''

    console.log('page', page, 'status', status, 'limit', limit, 'sort', sort)


    let filteredPages: SinglePage[] = [];
    if (q) {
        filteredPages = dummyPages.filter((page: SinglePage) => {
            return page.title.includes(q) || page.content.includes(q)
        })
    }
    filteredPages = dummyPages



    return {
        now: new Date().toISOString(),
        total: filteredPages.length,
        totalPages: Math.ceil(filteredPages.length / limit),
        page,
        items: filteredPages,

    }


};