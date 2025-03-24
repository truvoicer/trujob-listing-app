'use client';
import React from 'react';
import {Provider} from "react-redux";
import store from "@/library/redux/store";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

function TruLayout({children}) {
    return (
        <Provider store={store}>
            <body className={inter.className}>{children}</body>
        </Provider>
    );
}

export default TruLayout;
