
import React, {Suspense} from "react";
import App from "@/components/App";
import {TruJobApiMiddleware} from "@/library/middleware/api/TruJobApiMiddleware";

export async function generateMetadata({params, searchParams}, parent) {

  const routeParams = await params;
  let uri;
  const truJobApiMiddleware = new TruJobApiMiddleware();
  const settings = await truJobApiMiddleware.settingsRequest();
  const page = await truJobApiMiddleware.itemRequest(
      routeParams.item,
  );

  if (truJobApiMiddleware.apiMiddleware.hasErrors()) {
    throw new Error(
        `Failed to load data | ${JSON.stringify(truJobApiMiddleware.apiMiddleware.getErrors())}`,
    );
    return;
  }
  if (!page) {
    return;
  }
  let title = [];
  if (page?.data?.seo_title) {
    title.push(page.data.seo_title);
  }
    if (settings?.data?.seo_title) {
        title.push(settings.data.seo_title);
    }
  return {
    title: title.join(' | '),
  };
}

async function Item({params}) {
  const routeParams = await params;
  let uri;
  const truJobApiMiddleware = new TruJobApiMiddleware();
  const settings = await truJobApiMiddleware.settingsRequest();
  const page = await truJobApiMiddleware.itemRequest(
      routeParams.item,
  );
  if (!settings?.data) {
    return;
  }
  if (!page?.data) {
    return;
  }
  return (
      <Suspense>
          <App data={page.data} settings={settings.data} />
      </Suspense>
  )
}

export default Item;

