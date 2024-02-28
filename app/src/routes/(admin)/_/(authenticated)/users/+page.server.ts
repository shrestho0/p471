import type { SinglePage } from "@/types/pages-and-stuff";
import type { Actions, PageServerLoad } from "./$types";
import type { User } from "@/types/users";
import dbTables from "@/utils/db-tables";
import { fail } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ locals, url }) => {
    let page = Number.parseInt(url.searchParams.get('page') || '1')
    let limit = Number.parseInt(url.searchParams.get('limit') || '5')
    let sort = url.searchParams.get('sort') || '-created'
    let q = url.searchParams.get('qu') || ''


    let filter = '';
    if (q) {
        filter = `id~"${q}" || username ~"${q}" || email ~"${q}" || name ~"${q}"`
    }


    const users = await locals.pb.collection(dbTables.users).getList(page, limit, {
        filter: filter,
        sort: sort
    }).catch((err) => {
        console.error(err)
        return []
    });

    return structuredClone(users)


};

export const actions: Actions = {
    deleteUser: async ({ request, locals }) => {
        const formData = await request.formData()
        let error = false;
        await locals.pb.collection(dbTables.users).delete(formData.get('userId') as string).catch((err) => {
            error = true;
        })

        if (error) return fail(500, {
            message: 'Failed to delete user'
        })

        return {
            message: 'User deleted successfully'
        }
    },
    updateUser: async ({ request, locals }) => {
        const { userId, usernameX, emailX, nameX, passwordX } = Object.fromEntries(await request.formData()) as Record<string, string>
        console.log(userId, usernameX, emailX, nameX, passwordX)

        const updateData: Partial<User> = {}
        if (usernameX) updateData.username = usernameX?.trim()
        if (emailX) updateData.email = emailX?.trim()
        if (nameX) updateData.name = nameX?.trim()
        if (passwordX) {
            updateData.password = passwordX
            updateData.passwordConfirm = passwordX
        }

        console.log(updateData)


        if (Object.keys(updateData).length === 0) return fail(400, {
            message: 'No data to update'
        })


        const updatedUser = await locals.pb.collection(dbTables.users).update(userId as string, updateData).catch(() => {
            return null
        })

        if (!updatedUser) return fail(500, {
            message: 'Failed to update user'
        })

        return {
            message: 'User updated successfully',
            updatedUser: structuredClone(updatedUser)
        }
    }
};