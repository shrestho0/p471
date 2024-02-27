import type { SinglePage } from "@/types/pages-and-stuff";
import type { PageServerLoad } from "./$types";
import dummyData from "@/dev/dummyData";
import type { User } from "@/types/users";
export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let status = url.searchParams.get('status')
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'
    let q = url.searchParams.get('q') || ''

    console.log('page', page, 'status', status, 'limit', limit, 'sort', sort)


    let filteredPages: User[] = [];
    if (q) {
        filteredPages = dummyData.filter((page: User) => {
            return page.id.includes(q) || page.name.includes(q) || page.email.includes(q)
        })
    }
    filteredPages = dummyData



    return {
        now: new Date().toISOString(),
        total: filteredPages.length,
        totalPages: Math.ceil(filteredPages.length / limit),
        page,
        items: filteredPages,

    }


};