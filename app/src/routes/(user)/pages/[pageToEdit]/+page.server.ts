import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AppLinks } from "@/utils/app-links";
import type { EditPageLoadData } from "@/types/load-data";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals?.user) {
        redirect(307, AppLinks.USER_LOGIN);
    }

    const resObj = {
        pageExists: false,
        message: "Web page does not exist!",
        page: {}
    } as EditPageLoadData;

    const { pageToEdit } = params;
    if (pageToEdit == "published-page") {
        // check and return if valid page exists
        // Fetch page data from database
        resObj.pageExists = true;
        resObj.page = {
            id: "xyz",
            title: "Page Title",
            slug: "page-title",
            content: "Page content",
            user: locals.user.id,
            status: "published"
        }
        return resObj;
    } else if (pageToEdit == "banned-page") {
        // check and return if valid page exists
        // Fetch page data from database
        resObj.pageExists = true;
        resObj.page = {
            id: "abc",
            title: "Another Page Title",
            slug: "another-page-title",
            content: "Another page content",
            user: locals.user.id,
            status: "banned"
        }
        return resObj;
    } else if (pageToEdit == "draft-page") {
        // check and return if valid page exists
        // Fetch page data from database
        resObj.pageExists = true;
        resObj.page = {
            id: "def",
            title: "Draft Page Title",
            slug: "draft-page-title",
            content: "Draft page content",
            user: locals.user.id,
            status: "draft"
        }
        return resObj;
    }

    return resObj

    // Return page content from here
    // with success or failure message


};
