import { PB_SITE_KEY } from '$env/static/private';


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