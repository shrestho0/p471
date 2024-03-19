import dbTables from "@/utils/db-tables";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const returnObj = {
        totalPages: 0,
        todaysPages: 0,
        bannedPages: 0,
    }
    const totalPages = await locals.pb.collection(dbTables.pages).getList(1, 1).catch((err) => {
        return {
            totalItems: 0
        }
    })

    let today = (new Date()).toISOString()
    today = today.split("T")[0]
    // console.log(today.toISOString()?.split("T")[0])
    // today.toISOString()
    const todaysPages = await locals.pb.collection(dbTables.pages).getList(1, 1, {
        filter: `created >= "${today} 00:00:00"`
    }).catch((err) => {
        return {
            totalItems: 0
        }
    })

    const bannedPages = await locals.pb.collection(dbTables.pages).getList(1, 1, {
        filter: `status = "banned"`
    }).catch((err) => {
        return {
            totalItems: 0
        }
    })

    returnObj.totalPages = totalPages?.totalItems
    returnObj.todaysPages = todaysPages?.totalItems
    returnObj.bannedPages = bannedPages?.totalItems


    return returnObj

};