import dbTables from "@/utils/db-tables";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
    // we are safe here
    // get header and footer from user
    const { username } = params;

    const ownerHeader = await locals.pb.collection(dbTables.header).getFirstListItem(`user.username = "${username}"`).catch((e) => {
        return null;
    });
    const ownerFooter = await locals.pb.collection(dbTables.footer).getFirstListItem(`user.username = "${username}"`).catch((e) => {
        return null;
    });

    if (ownerHeader && ownerFooter) {
        return {
            siteHeader: structuredClone(ownerHeader),
            siteFooter: structuredClone(ownerFooter)
        }
    }



};