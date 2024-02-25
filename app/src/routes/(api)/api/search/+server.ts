import { json } from '@sveltejs/kit';


const data: SinglePage[] = [
    { id: "1", title: 'First page', content: 'This is the first page', 'slug': 'first-page', user: "", status: 'published' },
    { id: "2", title: 'Second page', content: 'This is the second page', 'slug': 'second-page', user: "", status: 'published' },
    { id: "3", title: 'Third page', content: 'This is the third page', 'slug': 'third-page', user: "", status: 'published' },
    { id: "4", title: 'Fourth page', content: 'This is the fourth page', 'slug': 'fourth-page', user: "", status: 'published' },
    { id: "5", title: 'Fifth page', content: 'This is the fifth page', 'slug': 'fifth-page', user: "", status: 'published' },
    { id: "6", title: 'Sixth page', content: 'This is the sixth page', 'slug': 'sixth-page', user: "", status: 'published' },
    { id: "7", title: 'Seventh page', content: 'This is the seventh page', 'slug': 'seventh-page', user: "", status: 'published' },
    { id: "8", title: 'Eighth page', content: 'This is the eighth page', 'slug': 'eighth-page', user: "", status: 'published' },
    { id: "9", title: 'Ninth page', content: 'This is the ninth page', 'slug': 'ninth-page', user: "", status: 'published' },
    { id: "10", title: 'Tenth page', content: 'This is the tenth page', 'slug': 'tenth-page', user: "", status: 'published' },
]

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
            const results = data.filter(page => page.title.includes(q) || page.slug.includes(q));
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