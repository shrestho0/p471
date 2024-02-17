import { PB_HOST } from "$env/static/private";
import { setPBSiteKey } from "@/utils/server";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import Pocketbase from 'pocketbase';

/**
 * Authentication Handler, Event Handler/Interceptor
 * This checks cookie, validates tokens and sets users in locals
 * This checks user types and sets locals.user or locals.admin
 */


export const AuthHandler = (async ({ event, resolve }) => {

    // Setting up pb
    const pb = new Pocketbase(PB_HOST)
    event.locals.pb = pb; // as pb will be used inside server load functions


    // Check cookies with pb lib
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {


        if (pb.authStore.isValid) {

            if (pb.authStore.isAdmin) {
                event.locals.pb.admins.authRefresh();
                event.locals.admin = structuredClone(event.locals.pb.authStore.model);
            } else if (pb.authStore.isAuthRecord) {
                pb.collection('users').authRefresh();
                event.locals.user = structuredClone(event.locals.pb.authStore.model);
            }
        }
    } catch (_) {
        event.locals.pb.authStore.clear();

    }

    // setting auth cookie in the response
    const response = await resolve(event);
    response.headers.set('set-cookie', pb.authStore.exportToCookie({
        path: '/',
        httpOnly: true,
        secure: false
    }))

    console.log("AuthHandler Called");
    return response;

}) satisfies Handle;


export const handle: Handle = sequence(AuthHandler);
