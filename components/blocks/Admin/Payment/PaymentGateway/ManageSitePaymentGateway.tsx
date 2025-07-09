import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense, useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { PaymentGateway } from "@/types/PaymentGateway";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { AppConfirmationContext } from "@/contexts/AppConfirmationContext";
import { AppModalContext } from "@/contexts/AppModalContext";
import EditSitePaymentGateway from "./EditSitePaymentGateway";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { FormikProps, FormikValues } from "formik";

export const CREATE_PAYMENT_METHOD_MODAL_ID = "create-payment-gateway-modal";
export const EDIT_PAYMENT_METHOD_MODAL_ID = "edit-payment-gateway-modal";
export const DELETE_PAYMENT_METHOD_MODAL_ID = "delete-payment-gateway-modal";
export const MANAGE_PAYMENT_GATEWAY_ID = "manage-payment-gateway-modal";

export interface ManageSitePaymentGatewayProps {}

function ManageSitePaymentGateway({}: ManageSitePaymentGatewayProps) {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);

  const confirmationContext = useContext(AppConfirmationContext);
  const notificationContext = useContext(AppNotificationContext);
  const modalContext = useContext(AppModalContext);

  async function fetchSitePaymentGateways() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.sitePaymentGateway,
      ]),
      method: ApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      // Handle error
      return;
    }
    if (Array.isArray(response.data)) {
      setPaymentGateways(response.data);
    } else {
      console.error(
        "Expected an array of payment gateways, but got:",
        response.data
      );
    }
  }

  async function handleSubmit(
    values: FormikValues,
    paymentGateway: PaymentGateway
  ) {
    const cloneValues: Record<string, unknown> = { ...values };
    const requestData: Record<string, unknown> = {};
    if (values.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active || false;
      delete cloneValues.is_active;
    }
    if (values.hasOwnProperty("is_default")) {
      requestData.is_default = values?.is_default || false;
      delete cloneValues.is_default;
    }
    if (values.hasOwnProperty("environment")) {
      requestData.environment = values?.environment || "sandbox";
      delete cloneValues.environment;
    }
    requestData.settings = cloneValues;

    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.sitePaymentGateway,
        paymentGateway?.id,
        "update",
      ]),
      method: ApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: requestData,
    });
    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to update payment gateway.",
        },
        "payment-methods-update-error-notification"
      );
      return false;
    }
    notificationContext.show(
      {
        variant: "success",
        message: "Payment gateway updated successfully.",
      },
      "payment-methods-update-success-notification"
    );
    fetchSitePaymentGateways();
    return true;
  }

  function getInitialValues(paymentGateway: PaymentGateway) {
    const initialValues: Record<string, unknown> = {
      is_active: paymentGateway?.site?.is_active ?? false,
      is_default: paymentGateway?.site?.is_default ?? false,
      environment: paymentGateway?.site?.environment ?? "sandbox",
    };
    if (paymentGateway?.required_fields) {
      paymentGateway.required_fields.forEach((field) => {
        if (field.type === "boolean") {
          initialValues[field.name] =
            paymentGateway?.site?.[field.name] ?? false;
        } else {
          initialValues[field.name] =
            paymentGateway?.site?.settings?.[field.name] ?? "";
        }
      });
    }
    return initialValues;
  }
  function onEditIntegrationClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    paymentGateway: PaymentGateway
  ) {
    e.preventDefault();
    modalContext.show(
      {
        formProps: {
          operation: "edit",
          initialValues: getInitialValues(paymentGateway),
          onSubmit: (values: FormikValues) => {
            return handleSubmit(values, paymentGateway);
          },
        },
        title: `Edit ${paymentGateway.label} Integration`,
        component: <EditSitePaymentGateway paymentGateway={paymentGateway} />,
        onOk: async ({
          formHelpers,
        }: {
          formHelpers?: FormikProps<FormikValues>;
        }) => {
          if (!formHelpers) {
            return;
          }
          if (typeof formHelpers?.submitForm !== "function") {
            console.warn("submitForm is not a function");
            return;
          }
          return await formHelpers.submitForm();
        },
      },
      EDIT_PAYMENT_METHOD_MODAL_ID
    );
  }

  function handleAddIntegrationClick(paymentGateway: PaymentGateway) {
    confirmationContext.show(
      {
        title: paymentGateway.label,
        message: `Are you sure you want to integrate ${paymentGateway.label}?`,
        onOk: async () => {
          const response =
            await TruJobApiMiddleware.getInstance().resourceRequest({
              endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.sitePaymentGateway,
                paymentGateway.id,
                "update",
              ]),
              method: ApiMiddleware.METHOD.PATCH,
              protectedReq: true,
            });
          if (!response) {
            notificationContext.show({
              type: "error",
              message: `Failed to integrate ${paymentGateway.label}.`,
            });
            return false;
          }
          notificationContext.show(
            {
              type: "success",
              message: `${paymentGateway.label} integrated successfully.`,
            },
            "payment-methods-integration-success-notification"
          );
          fetchSitePaymentGateways();
        },
      },
      "confirmation-integration"
    );
  }

  function handleUnintegrateClick(paymentGateway: PaymentGateway) {
    confirmationContext.show(
      {
        title: paymentGateway.label,
        message: `Are you sure you want to remove ${paymentGateway.label}?`,
        onOk: async () => {
          const response =
            await TruJobApiMiddleware.getInstance().resourceRequest({
              endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.sitePaymentGateway,
                paymentGateway.id,
                "destroy",
              ]),
              method: ApiMiddleware.METHOD.DELETE,
              protectedReq: true,
            });
          if (!response) {
            notificationContext.show({
              type: "error",
              message: `Failed to remove ${paymentGateway.label}.`,
            });
            return false;
          }
          notificationContext.show(
            {
              type: "success",
              message: `${paymentGateway.label} removed successfully.`,
            },
            "payment-methods-delete-success-notification"
          );
          fetchSitePaymentGateways();
        },
      },
      "confirmation-unintegration"
    );
  }

  function onIntegrationClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    paymentGateway: PaymentGateway
  ) {
    e.preventDefault();
    if (paymentGateway?.is_integrated) {
      handleUnintegrateClick(paymentGateway);
    } else {
      handleAddIntegrationClick(paymentGateway);
    }
  }

  useEffect(() => {
    fetchSitePaymentGateways();
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="py-4 border-bottom">
            <div className="form-title text-center">
              <h3>Integrations</h3>
            </div>
          </div>
        </div>
        {Array.isArray(paymentGateways) &&
          paymentGateways.length > 0 &&
          paymentGateways.map(
            (paymentGateway: PaymentGateway, index: number) => {
              return (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="card card-block card-stretch card-height">
                    <div className="card-body rounded work-detail work-detail-info">
                      <div className="icon iq-icon-box-2 mb-4 rounded">
                        <i className={`fab fa-${paymentGateway.icon}`}></i>
                      </div>
                      <h5 className="mb-2">{paymentGateway.label}</h5>
                      <p className="card-description">
                        {paymentGateway.description || <></>}
                      </p>
                      <div className="pt-3 d-flex flex-wrap align-items-center justify-content-between">
                        <a
                          href="#"
                          className="btn btn-info mr-3 px-4 btn-calendify"
                          onClick={(e) => {
                            onIntegrationClick(e, paymentGateway);
                          }}
                        >
                          {paymentGateway?.is_integrated
                            ? "Integrated"
                            : "Integrate"}
                        </a>
                        {paymentGateway?.is_integrated && (
                          <a
                            href="#"
                            className="btn btn-info mr-3 px-4 btn-calendify"
                            onClick={(e) => {
                              onEditIntegrationClick(e, paymentGateway);
                            }}
                          >
                            <i className="las la-edit"></i> Edit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </Suspense>
  );
}
export default ManageSitePaymentGateway;
