import AdminPageView from "@/components/Theme/Admin/View/AdminPageView";
import PageView from "@/components/Theme/Listing/view/PageView";
import { Page } from "@/types/Page";

export class ViewFactory {
    viewMap: Map<string, any>;

    constructor() {
        this.viewMap = new Map();
    }
    renderView(data: Page | null) {
        switch (data?.view) {
            case 'page':
                return <PageView data={data} />;
            case 'admin_page':
            case 'admin_tab_page':
                return <AdminPageView data={data} />;
            default:
                return null;
        }
    }

}
