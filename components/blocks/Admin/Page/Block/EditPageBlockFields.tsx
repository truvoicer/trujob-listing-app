import { useContext } from "react";
import SidebarForm from "../../Sidebar/SidebarForm";
import SelectPaginationTypes from "../SelectPaginationType";
import SelectPaginationScrollTypes from "../SelectPaginationScrollType";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Sidebar } from "@/types/Sidebar";
import { FormikValues, useFormikContext } from "formik";

type EditPageBlockFieldsProps = {
    index: number;
}
function EditPageBlockFields({ index = 0 }: EditPageBlockFieldsProps) {

    const dataTableContext = useContext(DataTableContext);

    const pageBlockSchema = {
        'default': false,
        'nav_title': '',
        'title': '',
        'subtitle': '',
        'background_image': '',
        'background_color': '',
        'pagination_type': '',
        'pagination': false,
        'pagination_scroll_type': '',
        'properties': [],
        'content': '',
        'has_sidebar': false,
        'sidebar_widgets': [],
        'order': 0,
    };

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    return (
        <>
            <div className="custom-control custom-checkbox mb-3 text-left">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name="default"
                    id={"default" + index}
                    checked={values?.default || false}
                    onChange={handleChange}
                />
                <label className="custom-control-label" htmlFor={'default' + index}>
                    Default?
                </label>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="nav_title"
                    id={"nav_title" + index}
                    onChange={handleChange}
                    value={values?.nav_title || ""} />
                <label className="form-label" htmlFor={'nav_title' + index}>Nav Title</label>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="title"
                    id={"title" + index}
                    onChange={handleChange}
                    value={values?.title || ""} />
                <label className="form-label" htmlFor={'title' + index}>Title</label>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="subtitle"
                    id={"subtitle" + index}
                    onChange={handleChange}
                    value={values?.subtitle || ""} />
                <label className="form-label" htmlFor={'subtitle' + index}>Subtitle</label>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="background_image"
                    id={"background_image" + index}
                    onChange={handleChange}
                    value={values?.background_image || ""} />
                <label className="form-label" htmlFor={'background_image' + index}>Background Image</label>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="background_color"
                    id={"background_color" + index}
                    onChange={handleChange}
                    value={values?.background_color || ""} />
                <label className="form-label" htmlFor={'background_color' + index}>Background Color</label>
            </div>
            <div className="custom-control custom-checkbox mb-3 text-left">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name="pagination"
                    id={"pagination" + index}
                    checked={values?.pagination || false}
                    onChange={handleChange}
                />
                <label className="custom-control-label" htmlFor={'pagination' + index}>
                    Pagination
                </label>
            </div>
            <SelectPaginationTypes
                value={values?.pagination_type}
                onChange={handleChange}
                showSubmitButton={false}
            />
            <SelectPaginationScrollTypes
                value={values?.pagination_scroll_type}
                onChange={handleChange}
                showSubmitButton={false}
            />
            <div className="floating-input form-group">
                <textarea
                    className="form-control"
                    name="content"
                    id={"content" + index}
                    onChange={handleChange}
                    value={values?.content || ""}></textarea>
                <label className="form-label" htmlFor={'content' + index}>Content</label>
            </div>
            {/* <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="properties"
                                            id={"properties" + index}
                                            
                                            onChange={handleChange}
                                            value={values?.properties || ""} />
                                        <label className="form-label" htmlFor={'properties' + index}>Properties</label>
                                    </div> */}
            <div className="custom-control custom-checkbox mb-3 text-left">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name="has_sidebar"
                    id={"has_sidebar" + index}
                    checked={values?.has_sidebar || false}
                    onChange={handleChange}
                />
                <label className="custom-control-label" htmlFor={'has_sidebar' + index}>
                    Has Sidebar
                </label>
            </div>
            <div className="floating-input form-group">
                <button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContext.modal.show({
                            title: "Manage Sidebars",
                            component: (
                                <SidebarForm
                                    data={values?.sidebars || []}
                                    onChange={(sidebars: Array<Sidebar>) => {
                                        setFieldValue('sidebars', sidebars);
                                    }}
                                />
                            ),
                            showFooter: false
                        }, 'page-edit-block-sidebar-widgets');
                    }}
                >
                    Manage Sidebars
                </button>
            </div>
            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="order"
                    id={"order" + index}
                    onChange={handleChange}
                    value={values?.order || ""} />
                <label className="form-label" htmlFor={'order' + index}>Order</label>
            </div>
        </>
    );
}
export default EditPageBlockFields;