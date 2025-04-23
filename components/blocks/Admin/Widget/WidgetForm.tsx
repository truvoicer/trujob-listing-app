import { FormContext } from "@/components/form/contexts/FormContext";
import Form from "@/components/form/Form";
import Reorder from "@/components/Reorder/Reorder";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import SelectWidget from "./SelectWidget";

function WidgetForm({ data = null, onChange = null }) {
    const [widgets, setWidgets] = useState(data || []);

    const appModalContext = useContext(AppModalContext);
    const formContext = useContext(FormContext);

    // async function pageWidgetRequest() {
    //     const response = await TruJobApiMiddleware.getInstance().pageWidgetsRequest(data?.id);
    //     if (!response) {
    //         return;
    //     }
    //     formContext.setFieldValue('widgets', response?.data || []);
    // }

    const pageWidgetSchema = {
        'title': '',
        'name': '',
        'icon': '',
    };
    function updateFieldValue(index, field, value) {
        const newData = [...widgets];
        newData[index][field] = value;
        setWidgets(newData);
    }
    function handleChange(values) {
        setWidgets(values);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(widgets);
        }
    }, [widgets]);
    console.log('widgets', widgets, data);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={pageWidgetSchema}
                    itemHeader={(item, index) => `${item?.title} (${item?.name})` || 'Item type error'}
                    data={widgets || []}
                    onChange={handleChange}
                    onAdd={({
                        reorderData,
                        setReorderData,
                        itemSchema
                    }) => {
                        appModalContext.show({
                            component: (
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <SelectWidget
                                            onSubmit={selectedWidget => {
                                                console.log('selectedWidget', selectedWidget);
                                                const newData = [...reorderData];
                                                newData.push({ ...pageWidgetSchema, ...selectedWidget });
                                                setReorderData(newData);
                                                appModalContext.close('page-edit-widget-select');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'page-edit-widget-select');
                    }}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>
                            
                            <div className="floating-input form-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        appModalContext.show({
                                            component: (
                                                <div className="row">
                                                    <div className="col-12 col-lg-12">
                                                        {/* {renderSideBarWidgets(block)} */}
                                                    </div>
                                                </div>
                                            ),
                                            showFooter: false
                                        }, 'page-edit-block-widget-widgets');
                                    }}
                                >
                                    Manage Widgets
                                </button>
                            </div>
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default WidgetForm;