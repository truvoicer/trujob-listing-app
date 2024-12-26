import HomeView from "@/components/view/HomeView";

export class ViewFactory {
    constructor() {
        this.viewMap = new Map();
    }
    renderView(view) {
        switch (view) {
            case 'home':
                return <HomeView />;
            default:
                return null;
        }
    }

}
