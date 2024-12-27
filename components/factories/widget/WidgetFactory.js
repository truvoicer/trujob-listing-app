import {Widgets} from "@/components/factories/widget/Widgets";

export class WidgetFactory {
    availableWidgets = null;
    constructor() {
        this.availableWidgets = Widgets.getWidgets();
    }
    renderWidget(widget) {
        if (!this.availableWidgets.hasOwnProperty(widget)) {
            return null;
        }
        return this.availableWidgets[widget];
    }

}
