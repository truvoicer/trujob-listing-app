import AdminPageView from "@/components/Theme/Admin/View/AdminPageView";
import PageView from "@/components/Theme/Listing/view/PageView";

export class ViewFactory {
    constructor() {
        this.viewMap = new Map();
    }
    renderView(data) {
        switch (data?.view) {
            case 'page':
                return <PageView data={data} />;
            case 'admin_page':
                return <AdminPageView data={data} />;
            default:
                return null;
        }
    }

}
