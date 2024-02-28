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
import type { User } from "@/types/users";
import macros from "@/utils/macros";


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

        const resObj: {
            pageOwner: User,
            pageContent: SinglePage
        } = {
            pageOwner: structuredClone(user) as unknown as User,
            pageContent: {
                id: "",
                title: "",
                slug: "",
                content: "",
                user: "",
                status: "published",
                created: "",
                updated: ""
            }
        }

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

            resObj.pageContent = structuredClone(page)

            macros.forEach((macro) => {
                resObj.pageContent.content = resObj.pageContent.content.replaceAll(macro.macro, resObj.pageOwner[macro.userKey])
            })


            return resObj;
        } else {
            // find profile page
            const profilePage = await locals.pb.collection(dbTables.profile).getFirstListItem(`user = "${user.id}"`).catch((err) => { return null; });
            // console.log("profile page paisi", profilePage)
            if (!profilePage) return error(404, ErrorMessages.PAGE_NOT_FOUND);


            resObj.pageContent = structuredClone(profilePage) as unknown as SinglePage;


            macros.forEach((macro) => {
                resObj.pageContent.content = resObj.pageContent.content.replaceAll(macro.macro, resObj.pageOwner[macro.userKey])
            })


            return resObj;
        }
    }


};