import React from 'react'

export const blockContextData = {
    ref: null,
    properties: {},
    title: null,
    subtitle: null,
    content: null,
    pagination_type: null,
    pagination_scroll_type: null,
    pagination: true,
    background_image: null,
    order: null
};
export const BlockContext = React.createContext(blockContextData);
