import React from 'react';
import PageHeader from "@/components/layout/Page/PageHeader";
import PageFooter from "@/components/layout/Page/PageFooter";

function PageSidebarLayout({ children }) {
    return (

        <div className="site-wrap">
            <PageHeader />
            <div className="row">
                <div className="col-lg-8">
                    {children}
                </div>
                <div className="col-lg-4">
                    <h1>Sidebar</h1>
                </div>
            </div>
            <PageFooter />
        </div>
    );
}

export default PageSidebarLayout;
