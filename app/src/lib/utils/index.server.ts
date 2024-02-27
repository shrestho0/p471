import type { SiteStyle } from "@/types/customizations";


import { PB_SITE_KEY } from '$env/static/private';
import { fail } from "@sveltejs/kit";


export async function setPBSiteKey(pb: import('pocketbase').default) {
    if (!pb) {
        throw new Error('Pocketbase instance is required')
    }

    pb.beforeSend = function (url, options) {
        options.headers = Object.assign({}, options.headers, {
            'x_site_key': PB_SITE_KEY,
        });
        return { url, options };
    };

    return pb
}


export function jsonToCSS(json: SiteStyle) {
    let css = "";
    if (json.fontLoadUrl) {
        css += `@import url('${json.fontLoadUrl}');`;
    }
    if (json.fontFamily) {
        css += `body{font-family: ${json.fontFamily};}`;
    }
    for (const tag in json.styleJson) {
        css += `${tag}{`;
        for (const prop in json.styleJson[tag]) {
            css += `${prop}:${json.styleJson[tag][prop]};`;
        }
        css += "}";
    }

    return css;
}



const UPDATE_RATE_LIMIT_TIME = 1000 * 60 * 5; // 5 minutes
export function rateLimitUpdate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    if (now.getTime() - date.getTime() > UPDATE_RATE_LIMIT_TIME) {

        return true;
    }
    return fail(429, { message: "Rate limit exceeded" });
}