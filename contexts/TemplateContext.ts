import React from 'react'

export const templateData = {
    products: {
        layout: null,
        paginationComponent: null,
        infiniteScrollComponent: null,
    }
};

export const TemplateContext = React.createContext(templateData);
