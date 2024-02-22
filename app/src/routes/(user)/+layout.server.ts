import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { AppLinks } from "@/utils/common";

export const load: LayoutServerLoad = async ({ locals, parent }) => {

    await parent();

    if (!locals.user) {
        return redirect(302, AppLinks.USER_LOGIN);
    }

};