import SearchFilterWidget from "@/components/listings/sidebar/widgets/SearchFilterWidget";
import RadiusFilterWidget from "@/components/listings/sidebar/widgets/RadiusFilterWidget";
import CategoryFilterWidget from "@/components/listings/sidebar/widgets/CategoryFilterWidget";


export class Widgets {
    static SEARCH_FILTER_WIDGET = 'search_filter';
    static PROXIMITY_FILTER_WIDGET = 'proximity_filter';
    static CATEGORY_FILTER_WIDGET = 'category_filter';

    static getWidgets() {
        return {
            [Widgets.SEARCH_FILTER_WIDGET]: {
                title: 'Search Filter',
                description: 'Search Filter Widget',
                icon: 'search',
                component: SearchFilterWidget,
                props: {
                    search: 'search'
                }
            },
            [Widgets.PROXIMITY_FILTER_WIDGET]: {
                title: 'Proximity Filter',
                description: 'Proximity Filter Widget',
                icon: 'map',
                component: RadiusFilterWidget,
                props: {
                    proximity: 'proximity'
                }
            },
            [Widgets.CATEGORY_FILTER_WIDGET]: {
                title: 'Category Filter',
                description: 'Category Filter Widget',
                icon: 'filter',
                component: CategoryFilterWidget,
                props: {
                    category: 'category'
                }
            }
        };
    }
}
