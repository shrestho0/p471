import type { NewOrEditPageData } from "@/types/load-data";
import { AppLinks } from "@/utils/app-links";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request, url }) => {
    if (!locals.user) {
        return redirect(307, AppLinks.USER_LOGIN)
    }

    const pageData: NewOrEditPageData = await request.json();
    console.log("/api/pages/new Page Data Received: ", pageData)

    return json({ success: false, message: "New Page Endpoint, not implemented" }, {
        status: 403,
    })
};