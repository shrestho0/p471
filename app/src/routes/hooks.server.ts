import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";



export const AuthHandler = (async ({ event, resolve }) => {

    console.log('AuthHandler Called');


    return await resolve(event);

}) satisfies Handle;


export const handle: Handle = sequence(AuthHandler);
