import type { RequestNewPage } from "@/types/load-data";
import { AppLinks } from "@/utils/app-links";
import dbTables from "@/utils/db-tables";
import { validRegex } from "@/utils/validations";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request, url }) => {
    if (!locals.user) {
        return redirect(307, AppLinks.USER_LOGIN)
    }

    const pageData: RequestNewPage = await request.json();
    const { title, slug, content, status } = pageData;


    // Validations
    const errors = { title: "", slug: "", content: "", }
    if (!validRegex.pageSlug.test(slug)) {
        errors.slug = "Invalid Slug. Slug should be 3-20 characters long and can contain a-z A-Z 0-9 - ."
    }
    if (!validRegex.pageTitle.test(title)) {
        errors.title = "Invalid Title. Title should be 5-20 characters long"
    }
    if (content?.length < 5) {
        errors.content = "Content should be 5-1000 characters long"
    }
    if (errors.title || errors.slug || errors.content) {
        return json({ success: false, message: "", errors }, {
            status: 400,
        })
    }

    // Check if page with same slug exists
    const pageExists = await locals.pb.collection(dbTables.pages).getFirstListItem(`slug = "${slug}" && user = "${locals.user.id}"`).catch((error) => {
        console.error("Error while checking if page exists", error)
        return null
    })

    if (pageExists) {
        return json({ success: false, message: "", errors: { slug: "Page with same slug already exists" } }, {
            status: 400,
        })
    }

    /////////////////////////////////
    ////// Safe to create new page
    /////////////////////////////////

    const newPage = await locals.pb.collection(dbTables.pages).create({
        title,
        slug: `${slug}`,
        content,
        status,
        user: locals.user.id,
    }).catch((error) => {
        console.error("Error while creating new page", error)
        return null
    })

    if (!newPage) {
        return json({ success: false, message: "Error while creating new page. Please report adminstrator about this issue." }, {
            status: 500,
        })

    }

    // console.log("/api/pages/new Page Data Received: ", pageData)

    return json({ success: true, message: "New page created successfully", redirect_to: `/pages/${newPage.id}` })

};