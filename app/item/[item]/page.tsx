
import React, { Suspense } from "react";
import App from "@/components/App";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import siteConfig from "@/config/site-config";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ page: string, item: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const routeParams = await params;
  let uri;
  const truJobApiMiddleware = new TruJobApiMiddleware();
  const site = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.site}/${siteConfig.site.name}`,
    method: ApiMiddleware.METHOD.GET,
  });
  const settings = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.settings}`,
    method: ApiMiddleware.METHOD.GET,
  });

  const page = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.page}/${routeParams.item}`,
    method: ApiMiddleware.METHOD.GET,
  });

  if (truJobApiMiddleware.hasErrors()) {
    throw new Error(
      `Failed to load data | ${JSON.stringify(truJobApiMiddleware.getErrors())}`,
    );
  }
  if (!page) {
    return Promise.resolve({});
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

async function Item({ params }: Props ) {
  const routeParams = await params;
  let uri;
  const truJobApiMiddleware = new TruJobApiMiddleware();
  const site = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.site}/${siteConfig.site.name}`,
    method: ApiMiddleware.METHOD.GET,
  });
  const settings = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.settings}`,
    method: ApiMiddleware.METHOD.GET,
  });

  const page = await truJobApiMiddleware.resourceRequest({
    endpoint: `${truJobApiConfig.endpoints.page}/${routeParams.item}`,
    method: ApiMiddleware.METHOD.GET,
  });
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

export default Item;

