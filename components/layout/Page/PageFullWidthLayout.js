import React from 'react';
import PageHeader from "@/components/layout/Page/PageHeader";
import PageFooter from "@/components/layout/Page/PageFooter";

function PageFullWidthLayout({children}) {
    return (

        <div className="site-wrap">
            <PageHeader/>
                {children}
            <PageFooter/>
        </div>
    );
}

export default PageFullWidthLayout;
