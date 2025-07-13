import AdminPageView from "@/components/Theme/Admin/View/AdminPageView";
import PageView from "@/components/Theme/Product/view/PageView";
import { Page } from "@/types/Page";
import { PAGE_VIEW_ADMIN_PAGE, PAGE_VIEW_ADMIN_TAB_PAGE, PAGE_VIEW_PAGE } from "../redux/constants/page-constants";

export class ViewFactory {
    viewMap: Map<string, unknown>;

    constructor() {
        this.viewMap = new Map();
    }
    renderView(data: Page | null) {
        switch (data?.view) {
            case PAGE_VIEW_PAGE:
                return <PageView data={data} />;
            case PAGE_VIEW_ADMIN_PAGE:
            case PAGE_VIEW_ADMIN_TAB_PAGE:
                return <AdminPageView data={data} />;
            default:
                return null;
        }
    }

}
