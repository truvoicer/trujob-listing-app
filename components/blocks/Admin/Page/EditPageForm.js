import { FormContext } from "@/components/form/contexts/FormContext";
import Form from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import PageBlockForm from "./PageBlockForm";

function EditPageForm({ data }) {
    const appModalContext = useContext(AppModalContext);
    const formContext = useContext(FormContext);
    
    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="custom-control custom-checkbox mb-3 text-left">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id="is_active"
                        name="is_active"
                        onChange={formContext.onChange}
                        checked={formContext?.values?.is_active || false} />
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
                        onChange={formContext.onChange}
                        checked={formContext?.values?.is_featured || false} />
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
                        onChange={formContext.onChange}
                        checked={formContext?.values?.is_home || false} />
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
                        onChange={formContext.onChange}
                        value={formContext?.values?.title || ""} />
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
                        onChange={formContext.onChange}
                        value={formContext?.values?.name || ""} />
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
                        onChange={formContext.onChange}
                        value={formContext?.values?.permalink || ""} />
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
                        onChange={formContext.onChange}
                        value={formContext?.values?.content || ""}></textarea>
                    <label className="form-label" htmlFor="content">Content</label>
                </div>
            </div>


            <div className="col-12 col-lg-6">
                <PageBlockForm data={data} />
            </div>
        </div>
    );
}
export default EditPageForm;