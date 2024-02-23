import { PB_HOST, PB_SITE_KEY } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import Pocketbase, { Admin, Record } from 'pocketbase';


/**
 * Authentication Handler, Event Handler/Interceptor
 * This checks cookie, validates tokens and sets users in locals
 * This checks user types and sets locals.user or locals.admin
 */


export const AuthHandler = (async ({ event, resolve }) => {

    if (!PB_HOST || !PB_SITE_KEY) {

        console.error("PB_HOST || PB_SITE_KEY  is not set. This service is dependent on Pocketbase, thus the keys are required.");
        process.exit(68);
    }


    // Setting up pb
    event.locals.pb = new Pocketbase(PB_HOST)

    // as pb will be used inside server load functions
    if (!event.locals.pb) {
        console.error("Pocketbase not initialized")
        process.exit(69);
    }


    // Check cookies with pb lib
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        if (event.locals.pb.authStore.isValid) {
            if (event.locals.pb.authStore.model instanceof Admin) {
                await event.locals.pb.admins.authRefresh();
                event.locals.admin = structuredClone(event.locals.pb.authStore.model);
            } else if (event.locals.pb.authStore.model instanceof Record) {
                await event.locals.pb.collection('users').authRefresh();
                event.locals.user = structuredClone(event.locals.pb.authStore.model);
            }
        }
    } catch (_) {
        event.locals.pb.authStore.clear();
        event.locals.user = null;
        event.locals.admin = null;
    }
    console.log("admin auth refresh hoye gese")



    // setting auth cookie in the response
    console.log("Event resolving")
    const response = await resolve(event);
    console.log("Event resolved. Response set hocche")



    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({
        path: '/',
        httpOnly: true,
        secure: false
    }))


    console.log("AuthHandler Called. Hook er Kaj Shesh", event.url.pathname);
    return response;

}) satisfies Handle;


export const handle: Handle = sequence(AuthHandler);