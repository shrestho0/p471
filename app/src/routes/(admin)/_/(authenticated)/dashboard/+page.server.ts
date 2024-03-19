import type { AdminDashboardAggData } from "@/types/load-data";
import type { PageServerLoad } from "./$types";
import dbTables from "@/utils/db-tables";

export const load: PageServerLoad = async ({ locals }) => {
    const returnObj: AdminDashboardAggData = {
        totalPages: 0,
        todaysPages: 0,
        totalUsers: 0,
        todaysUsers: 0,
        bannedPages: 0
    }

    const totalPages = await locals.pb.collection(dbTables.pages).getList(1, 1).catch((err) => ({ totalItems: 0 }))
    const totalUsers = await locals.pb.collection(dbTables.users).getList(1, 1).catch((err) => ({ totalItems: 0 }))

    let today = (new Date()).toISOString()
    today = today.split("T")[0]


    const todaysPages = await locals.pb.collection(dbTables.pages).getList(1, 1, {
        filter: `created >= "${today} 00:00:00"`
    }).catch((err) => {
        return {
            totalItems: 0
        }
    })

    const todaysUsers = await locals.pb.collection(dbTables.users).getList(1, 1, {
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
    returnObj.totalUsers = totalUsers?.totalItems
    returnObj.todaysPages = todaysPages?.totalItems
    returnObj.todaysUsers = todaysUsers?.totalItems
    returnObj.bannedPages = bannedPages?.totalItems

    return returnObj;

};