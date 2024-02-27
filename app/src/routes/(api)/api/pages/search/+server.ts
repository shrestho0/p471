import { dummyPages } from '@/dev/dummyPages';
import type { SinglePage } from '@/types/pages-and-stuff';
import { json } from '@sveltejs/kit';



export const GET = async ({ url }) => {
    const q = url.searchParams.get('q'); // query
    const t = url.searchParams.get('t'); // type
    if (!q) {
        return json({
            success: false,
            message: 'Invalid request - query is required',
            results: []
        }, {
            status: 403
        });

    }

    switch (t) {
        case 'page':
            // search for pages with title or slug matching the query
            const results = dummyPages.filter(page => page.title.includes(q) || page.slug.includes(q));
            return json({
                success: true,
                query: q,
                results
            });
        default:
            return json({
                success: false,
                message: 'Invalid request - valid type is required',
                results: []
            }, {
                status: 403
            });

    }
};