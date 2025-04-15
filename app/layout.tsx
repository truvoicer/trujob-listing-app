import AppLayout from "@/components/AppLayout";
import {isNotEmpty} from "@/helpers/utils";
import {ApiMiddleware} from "@/library/middleware/api/ApiMiddleware";
import '@/assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css';
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ page: string}>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 type LayoutProps = {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const globalMeta = await ApiMiddleware.getGlobalMeta();
  if (!isNotEmpty(globalMeta)) {
    return {};
  }
  return globalMeta;
}

export default async function RootLayout(props: LayoutProps) {
  const { children } = props;
  return (
    <html lang="en">
      <AppLayout {...props}>
        {children}
      </AppLayout>
    </html>
  );
}
