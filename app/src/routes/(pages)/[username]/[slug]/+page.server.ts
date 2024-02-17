import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
    const { username, slug } = params;

    return {
        username,
        slug,
        user: locals?.user,
        admin: locals?.admin,
    };

};