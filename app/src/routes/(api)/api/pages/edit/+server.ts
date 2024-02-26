import type { NewOrEditPageData } from "@/types/load-data";
import { AppLinks } from "@/utils/app-links";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request, url }) => {
    if (!locals.user) {
        return redirect(307, AppLinks.USER_LOGIN)
    }

    const pageId = url.searchParams.get("pageId");
    // console.log("Page ID: ", pageId, url.searchParams)
    if (!pageId) {
        return json({ success: false, message: "Invalid page id. Accepts: ?pageId=[PAGE_ID]" })
    }


    const pageData: NewOrEditPageData = await request.json();
    console.log("/api/pages/new Page Data Received: ", pageData)

    return json({ success: false, message: "Edit Page Endpoint, not implemented" }, {
        status: 403,
    })
};