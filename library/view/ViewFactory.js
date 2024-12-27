import PageView from "@/components/view/PageView";

export class ViewFactory {
    constructor() {
        this.viewMap = new Map();
    }
    renderView(data) {
        switch (data?.view) {
            case 'page':
                return <PageView data={data} />;
            default:
                return null;
        }
    }

}
