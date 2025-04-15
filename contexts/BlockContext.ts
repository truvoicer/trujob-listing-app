import React from 'react'

export const blockContextData = {
    ref: null,
    first_block: false,
    last_block: false,
    properties: {},
    has_sidebar: false,
    sidebar_widgets: [],
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
