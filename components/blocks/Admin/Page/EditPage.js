import Form from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import EditPageForm from "./EditPageForm";

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
                    <EditPageForm data={data} />
                </Form>
            </div>
        </div>
    );
}
export default EditPage;