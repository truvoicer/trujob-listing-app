
import React, {Suspense} from "react";
import App from "@/components/App";
import {TruJobApiMiddleware} from "@/library/middleware/api/TruJobApiMiddleware";
import siteConfig from "@/config/site-config";

export async function generateMetadata({params, searchParams}, parent) {

  const routeParams = await params;
  let uri;
  if (Array.isArray(routeParams.page)) {
    uri = routeParams.page.join("/");
  }

  const truJobApiMiddleware = new TruJobApiMiddleware();
  const site = await truJobApiMiddleware.siteRequest(siteConfig.site.name);
  const settings = await truJobApiMiddleware.settingsRequest();
  const page = await truJobApiMiddleware.pageRequest(
      `/${uri}`,
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
    if (site?.data?.seo_title) {
        title.push(site.data.seo_title);
    }
  return {
    title: title.join(' | '),
  };
}

async function Home({params}) {
  const routeParams = await params;
  let uri;
  if (Array.isArray(routeParams.page)) {
    uri = routeParams.page.join("/");
  }
  const truJobApiMiddleware = new TruJobApiMiddleware();
  const site = await truJobApiMiddleware.siteRequest(siteConfig.site.name);
  const settings = await truJobApiMiddleware.settingsRequest();
  const page = await truJobApiMiddleware.pageRequest(
      `/${uri}`,
  );
  console.log(site, settings, page, `/${uri}`);
  if (!settings?.data) {
    return;
  }
  if (!page?.data) {
    return;
  }
  if (!site?.data) {
    return;
  }
  return (
      <Suspense>
          <App data={page.data} settings={settings.data} site={site.data} />
      </Suspense>
  )
}

export default Home;

