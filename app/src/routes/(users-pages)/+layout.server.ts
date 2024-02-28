// import { setPBSiteKey } from "@/utils/index.server";
// import type { LayoutServerLoad } from "../$types";
// import dbTables from "@/utils/db-tables";
// import { error } from "@sveltejs/kit";

import { setPBSiteKey } from "@/utils/index.server";
import type { LayoutServerLoad } from "../$types";
import dbTables from "@/utils/db-tables";
import { error } from "@sveltejs/kit";
import { ErrorMessages } from "@/utils/messages";
import type { SinglePage } from "@/types/pages-and-stuff";


export const load: LayoutServerLoad = async ({ locals, params }) => {
    /**
     * Checks for user and page
     * If user  and page exists, finds and returns user specific designs
     * Else, returns 404
     */
    const { username, slug } = params;



    setPBSiteKey(locals.pb);

    if (username) {
        const user = await locals.pb.collection(dbTables.users).getFirstListItem(`username = "${username}"`).catch((err) => { return null; });
        // console.log("owner user paisi", user)
        if (!user) return error(404, ErrorMessages.PAGE_NOT_FOUND);

        if (slug) {
            const page: SinglePage | null = await locals.pb.collection(dbTables.pages).getFirstListItem(`slug = "${slug}" && user="${user.id}"`).catch((err) => { return null }) as SinglePage | null;
            // console.log("page paisi", page)
            if (!page) return error(404, ErrorMessages.PAGE_NOT_FOUND);

            // if draft, only owner can view this
            if (page.status == "draft" && !(locals?.user?.id == page.user)) {
                return error(403, ErrorMessages.PAGE_NOT_PUBLIC);
                // console.log("page banned")
            }

            if (page.status == "banned" && !(locals?.user?.id == page.user)) {
                return error(403, ErrorMessages.PAGE_BANNED);
            }

            return {
                pageOwner: structuredClone(user),
                pageContent: structuredClone(page),
            };
        } else {
            // find profile page
            const profilePage = await locals.pb.collection(dbTables.profile).getFirstListItem(`user = "${user.id}"`).catch((err) => { return null; });
            // console.log("profile page paisi", profilePage)
            if (!profilePage) return error(404, ErrorMessages.PAGE_NOT_FOUND);

            return {
                pageOwner: structuredClone(user),
                pageContent: structuredClone(profilePage),
            };
        }
    }


    // // console.log("finding for page or profile page (/)")
    // setPBSiteKey(locals.pb);
    // const page = await locals.pb.collection(dbTables.pages).getFirstListItem(`slug = "${slug ? slug : '/'}" && user="${user.id}"`).catch((err) => { return null });
    // // console.log("page paisi", page)
    // if (!page) return error(404, ErrorMessages.PAGE_NOT_FOUND);


    // return {
    //     pageOwner: structuredClone(user),
    //     pageContent: structuredClone(page),
    // };

};