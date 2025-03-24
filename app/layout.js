
import "@/assets/sass/style.scss";
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
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <TruLayout>
        {children}
      </TruLayout>
    </html>
  );
}
