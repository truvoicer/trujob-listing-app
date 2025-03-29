'use client';
import React from 'react';
import {Provider} from "react-redux";
import store from "@/library/redux/store";
import {Inter} from "next/font/google";
import { TruJobApiMiddleware } from '@/library/middleware/api/TruJobApiMiddleware';

const inter = Inter({subsets: ['latin']})

function TruLayout(props) {
    const {children, params} = props;

//   const routeParams = await params;
//   let uri;
//   if (Array.isArray(routeParams.page)) {
//     uri = routeParams.page.join("/");
//   }

//   const truJobApiMiddleware = new TruJobApiMiddleware();
//   const page = await truJobApiMiddleware.pageRequest(
//       `/${uri}`,
//   );
//   console.log(routeParams)
    return (
        <Provider store={store}>
            <body className={inter.className}>{children}</body>
        </Provider>
    );
}

export default TruLayout;
