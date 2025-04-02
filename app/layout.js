import AppLayout from "@/components/AppLayout";
import {isNotEmpty} from "@/helpers/utils";
import {ApiMiddleware} from "@/library/middleware/api/ApiMiddleware";
import '@/assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css';


export async function generateMetadata({ params, searchParams }, parent) {
  const globalMeta = await ApiMiddleware.getGlobalMeta();
  if (!isNotEmpty(globalMeta)) {
    return {};
  }
  return globalMeta;
}
export default async function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="en">
      <AppLayout {...props}>
        {children}
      </AppLayout>
    </html>
  );
}
