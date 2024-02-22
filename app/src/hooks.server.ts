import { PB_HOST, PB_SITE_KEY } from "$env/static/private";
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

    if (!PB_HOST || !PB_SITE_KEY) {
        console.error("PB_HOST || PB_SITE_KEY  is not set. This service is dependent on Pocketbase, thus the keys are required.");
        process.exit(69);
    }

    // Setting up pb
    event.locals.pb = new Pocketbase(PB_HOST)
    // as pb will be used inside server load functions


    // Check cookies with pb lib
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {


        if (event.locals.pb.authStore.isValid) {

            if (event.locals.pb.authStore.isAdmin) {
                event.locals.pb.admins.authRefresh();
                event.locals.admin = structuredClone(event.locals.pb.authStore.model);
            } else if (event.locals.pb.authStore.isAuthRecord) {
                event.locals.pb.collection('users').authRefresh();
                event.locals.user = structuredClone(event.locals.pb.authStore.model);
            }
        }
    } catch (_) {
        // console.log("AuthHandler Error", _);
        event.locals.pb?.authStore && event.locals.pb.authStore.clear();
        event.locals.admin = null;
        event.locals.user = null;
    }



    // setting auth cookie in the response
    const response = await resolve(event);
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({
        path: '/',
        httpOnly: true,
        secure: false
    }))

    console.log("AuthHandler Called", event.url.pathname);
    return response;

}) satisfies Handle;


export const handle: Handle = sequence(AuthHandler);
