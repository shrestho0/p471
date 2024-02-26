import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AppLinks } from "@/utils/app-links";
import type { EditPageLoadData } from "@/types/load-data";
import type { SinglePage } from "@/types/pages-and-stuff";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals?.user) {
        redirect(307, AppLinks.USER_LOGIN);
    }

    const resObj = {
        pageExists: false,
        message: "Web page does not exist!",
        page: {}
    } as EditPageLoadData;

    const profilePage = {
        id: "some-id",
        title: "Profile",
        slug: "profile",
        content: "This is the profile page"
    } as SinglePage;

    resObj.page = profilePage;
    resObj.pageExists = true;


    return resObj

    // Return page content from here
    // with success or failure message


};
