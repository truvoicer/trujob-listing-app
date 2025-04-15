'use client';
import React from 'react';
import {Provider} from "react-redux";
import store from "@/library/redux/store";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

type LayoutProps = {
    children: React.ReactNode;
    params: { [key: string]: string | string[] | undefined };
    searchParams: { [key: string]: string | string[] | undefined };
  };

function AppLayout(props: LayoutProps) {
    const {children, params} = props;
    return (
        <Provider store={store}>
            <body className={inter.className}>{children}</body>
        </Provider>
    );
}

export default AppLayout;
