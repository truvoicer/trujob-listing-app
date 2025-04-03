import Form from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import PageBlockForm from "./PageBlockForm";

function EditPage({ data }) {
    const [initialValues, setInitialValues] = useState({
        name: data?.name || '',
        title: data?.title || '',
        permalink: data?.permalink || '',
        content: data?.content || '',
        is_active: data?.is_active || false,
        is_featured: data?.is_featured || false,
        is_home: data?.is_home || false,
        blocks: data?.blocks || [],
        has_sidebar: data?.has_sidebar || false,
        sidebar_widgets: data?.sidebar_widgets || [],
        settings: {
            meta_title: data?.settings?.meta_title || '',
            meta_description: data?.settings?.meta_description || '',
            meta_keywords: data?.settings?.meta_keywords || '',
            meta_robots: data?.settings?.meta_robots || '',
            meta_canonical: data?.settings?.meta_canonical || '',
            meta_author: data?.settings?.meta_author || '',
            meta_publisher: data?.settings?.meta_publisher || '',
            meta_og_title: data?.settings?.meta_og_title || '',
            meta_og_description: data?.settings?.meta_og_description || '',
            meta_og_type: data?.settings?.meta_og_type || '',
            meta_og_url: data?.settings?.meta_og_url || '',
            meta_og_image: data?.settings?.meta_og_image || '',
            meta_og_site_name: data?.settings?.meta_og_site_name || ''
        }
    });
    const appModalContext = useContext(AppModalContext);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">

                <Form
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        console.log('values', values);
                        // const response = await TruJobApiMiddleware.getInstance().updatePageRequest(data?.id, values);
                        // if (response) {
                        //     appModalContext.hideModal();
                        // }
                    }}
                >
                    {({
                        values,
                        errors,
                        onChange,
                    }) => (
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <div className="custom-control custom-checkbox mb-3 text-left">
                                    <input
                                        onChange={e => {
                                            console.log('e', e);
                                            onChange(e);
                                        }}
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="is_active"
                                        name="is_active"
                                        checked={values?.is_active || false} />
                                    <label className="custom-control-label" htmlFor="is_active">
                                        Is active
                                    </label>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6">
                                <div className="custom-control custom-checkbox mb-3 text-left">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="is_featured"
                                        name="is_featured"
                                        onChange={onChange}
                                        checked={values?.is_featured || false} />
                                    <label className="custom-control-label" htmlFor="is_featured">
                                        Is Featured
                                    </label>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6">
                                <div className="custom-control custom-checkbox mb-3 text-left">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="is_home"
                                        name="is_home"
                                        onChange={onChange}
                                        checked={values?.is_home || false} />
                                    <label className="custom-control-label" htmlFor="is_home">
                                        Is Home
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="floating-input form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="title"
                                        id="title"
                                        required=""
                                        onChange={onChange}
                                        value={values?.title || ""} />
                                    <label className="form-label" htmlFor="title">Title</label>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="floating-input form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        id="name"
                                        required=""
                                        onChange={onChange}
                                        value={values?.name || ""} />
                                    <label className="form-label" htmlFor="name">Name</label>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="floating-input form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="permalink"
                                        id="permalink"
                                        required=""
                                        onChange={onChange}
                                        value={values?.permalink || ""} />
                                    <label className="form-label" htmlFor="permalink">Permalink</label>
                                </div>
                            </div>


                            <div className="col-12 col-lg-6">
                                <div className="floating-input form-group">
                                    <textarea
                                        className="form-control"
                                        name="content"
                                        id="content"
                                        required=""
                                        onChange={onChange}
                                        value={values?.content || ""}></textarea>
                                    <label className="form-label" htmlFor="content">Content</label>
                                </div>
                            </div>


                            <div className="col-12">
                                <PageBlockForm data={data} />
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
export default EditPage;