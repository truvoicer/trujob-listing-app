import Loader from "@/components/Loader";
import {
  SESSION_STATE,
  SESSION_USER,
} from "@/library/redux/constants/session-constants";
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppModalContext } from "@/contexts/AppModalContext";
import OrderSummary from "@/components/Theme/Admin/Order/Summary/OrderSummary";
import { CheckoutContext } from "../Checkout/context/CheckoutContext";
import { RootState } from "@/library/redux/store";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageProductPrice from "@/components/blocks/Admin/Product/Price/ManageProductPrice";
import { StepperComponentProps } from "@/components/Elements/Stepper";
import ManagePriceType from "@/components/blocks/Admin/PriceType/ManagePriceType";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";

export const MANAGE_ADDRESS_MODAL_ID = "manage-address-modal";
export type PriceType = {
  session: SessionState;
  productId: number;
};
function PriceType({
  session,
  productId,
  showNext,
}: PriceType & StepperComponentProps) {
  const [show, setShow] = useState(false);
  const checkoutContext = useContext(CheckoutContext);
  const order = checkoutContext.order;
  console.log("PriceType order:", productId);
  return (
    <AccessControlComponent
      id="manage-price-type"
      roles={[{ name: "admin" }, { name: "superuser" }]}
    >
      <ManagePriceType
        operation="edit"
        mode="selector"
        rowSelection={true}
        multiRowSelection={false}
        enableEdit={false}
        paginationMode="state"
        fetchItemsRequest={async ({
          post,
          query,
        }: {
          post?: Record<string, unknown>;
          query?: Record<string, unknown>;
        }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productPriceType.replace(
                ":productId",
                productId.toString()
              ),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        onChange={(priceTypes: Array<any>) => {
          if (!Array.isArray(priceTypes)) {
            console.warn("Invalid values received from ManageUser component");
            return;
          }

          if (priceTypes.length === 0) {
            console.warn("Price types is empty");
            return true;
          }
          const checked = priceTypes.filter((item) => item?.checked);
          if (checked.length === 0) {
            console.warn("No price type selected");
            return true;
          }
          const selected = checked[0];

          checkoutContext.update({
            priceType: selected,
          });
          if (typeof showNext === "function") {
            showNext();
          }
        }}
      />
    </AccessControlComponent>
  );
}

export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(PriceType);
