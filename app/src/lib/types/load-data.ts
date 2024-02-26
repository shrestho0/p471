import type { PageStatus } from "./pages-and-stuff";

export type EditPageLoadData = {
    pageExists: boolean;
    message: string;
    page: {
        id: string;
        title: string;
        slug: string;
        content: string;
        user: string;
        status: PageStatus
    };
}

export type NewOrEditPageData = {
    status: PageStatus;
    pageId: string;
    title: {
        value: string;
        error: string;
    };
    slug: {
        value: string;
        error: string;
    };
    content: {
        value: string;
        error: string;
    };
};