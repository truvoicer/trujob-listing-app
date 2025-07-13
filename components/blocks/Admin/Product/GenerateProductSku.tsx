import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Product } from "@/types/Product";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import TextInput from "@/components/Elements/TextInput";
import Select from "@/components/Elements/Select";
import { Button, Modal } from "react-bootstrap";
import { FormikProps } from "formik";

export type GenerateProductSkuFormValues = {
  sku?: string;
  type: "generate" | "custom";
};
export type GenerateProductSkuProps = {
  product: Product;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};
function GenerateProductSku({
  product,
  showModal,
  setShowModal,
}: GenerateProductSkuProps) {
  const [sku, setSku] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

  async function handleSubmit(values: GenerateProductSkuFormValues) {
    if (!product || isObjectEmpty(product)) {
      setAlert({
        show: true,
        message: "Product is required to generate SKU.",
        type: "danger",
      });
      return false;
    }
    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: `${truJobApiConfig.endpoints.product}/${product.id}/sku/update`,
      method: ApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: values,
    });

    if (!response?.data?.sku) {
      setAlert({
        show: true,
        message: (
          <div>
            <strong>Error:</strong>
            {truJobApiMiddleware
              .getErrors()
              .map((error: ErrorItem, index: number) => {
                return <div key={index}>{error.message}</div>;
              })}
          </div>
        ),
        type: "danger",
      });
      return false;
    }
    setSku(response.data.sku);
    dataTableContext.refresh();
  }

  useEffect(() => {
    if (product?.sku) {
      setSku(product.sku);
    }
  }, [product]);

  function renderForm(formikProps: FormikProps<GenerateProductSkuFormValues>) {
    const { handleChange, values } = formikProps;
    return (
      <div className="row justify-content-center align-items-center">
        <div className="col-md-12 col-sm-12 col-12 align-self-center">
          {alert && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}
          <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
              <div className="row">
                {sku && (
                  <div className="col-12">
                    <ul className="list-unstyled">
                      <li>
                        <strong>Product Name:</strong> {product.name}
                      </li>
                      <li>
                        <strong>Product ID:</strong> {product.id}
                      </li>
                      <li>
                        <strong>Current SKU:</strong> {sku || "N/A"}
                      </li>
                    </ul>
                  </div>
                )}
                <div className="col-12 col-lg-6">
                  <Select
                    value={values?.type || ""}
                    onChange={handleChange}
                    placeholder="Enter SKU"
                    name="type"
                    label="SKU Type"
                    options={[
                      { label: "Generate", value: "generate" },
                      { label: "Custom", value: "custom" },
                    ]}
                  />
                </div>
                {values?.type === "custom" && (
                  <div className="col-12 col-lg-6">
                    <TextInput
                      value={values?.sku || ""}
                      onChange={handleChange}
                      placeholder="Enter SKU"
                      name="sku"
                      type="text"
                      label="SKU"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      fullscreen={false}
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Form
        operation={"edit"}
        requiredFields={{ type: true }}
        initialValues={{
          sku: product?.sku || "",
          type: "generate",
        }}
        onSubmit={handleSubmit}
      >
        {(formikProps: FormikProps<GenerateProductSkuFormValues>) => {
          return (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Generate SKU</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {product ? renderForm(formikProps) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
                <Button type="submit" className="btn btn-primary">
                  Save changes
                </Button>
              </Modal.Footer>
            </>
          );
        }}
      </Form>
    </Modal>
  );
}
export default GenerateProductSku;
