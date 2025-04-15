import React from 'react'

export const templateData = {
    listings: {
        layout: null,
        paginationComponent: null,
        infiniteScrollComponent: null,
    }
};

export const TemplateContext = React.createContext(templateData);
