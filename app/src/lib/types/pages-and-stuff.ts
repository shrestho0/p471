

interface SinglePage {
    id: string;
    title: string;
    slug: string;
    content: string;
    user: string;
    status: 'published' | 'draft' | 'banned';
}