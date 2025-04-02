'use client';
import React from 'react';
import {Provider} from "react-redux";
import store from "@/library/redux/store";
import {Inter} from "next/font/google";
import { TruJobApiMiddleware } from '@/library/middleware/api/TruJobApiMiddleware';

const inter = Inter({subsets: ['latin']})

function AppLayout(props) {
    const {children, params} = props;
    return (
        <Provider store={store}>
            <body className={inter.className}>{children}</body>
        </Provider>
    );
}

export default AppLayout;
