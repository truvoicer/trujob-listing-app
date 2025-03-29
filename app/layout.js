import TruLayout from "@/components/Theme/TruLayout";
import {isNotEmpty} from "@/helpers/utils";
import {ApiMiddleware} from "@/library/middleware/api/ApiMiddleware";


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
      <TruLayout {...props}>
        {children}
      </TruLayout>
    </html>
  );
}
