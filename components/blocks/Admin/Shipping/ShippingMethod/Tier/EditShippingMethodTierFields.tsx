import { FormikValues, useFormikContext } from "formik";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";
import SelectShippingUnit from "../../SelectShippingUnit";
import SelectShippingWeightUnit from "../../SelectShippingWeightUnit";
import { LocaleService } from "@/library/services/locale/LocaleService";

type EditShippingMethodTierFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingMethodTierFields({}: EditShippingMethodTierFields) {
  const { values, setFieldValue, handleChange, errors } =
    useFormikContext<FormikValues>() || {};

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.label || ""}
              onChange={handleChange}
              placeholder="Enter label"
              name="label"
              type="text"
              label="Label"
              error={errors?.label}
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
              name="description"
              type="text"
              label="Description"
              error={errors?.description}
            />
          </div>

          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_active"}
              placeholder="Is Active?"
              label="Is Active?"
              onChange={handleChange}
              value={values?.is_active || false}
            />
          </div>


          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_max_dimension"
              value={values?.has_max_dimension || false}
              onChange={handleChange}
              label="Has Max Dimension?"
              placeholder="Has Max Dimension?"
            />
          </div>
          {values?.has_max_dimension && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_dimension || 0}
                  onChange={handleChange}
                  placeholder="Enter max overall dimension"
                  name="max_dimension"
                  type="number"
                  label="Max Dimension"
                  error={errors?.max_dimension}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="max_dimension_unit"
                  value={values?.max_dimension_unit || "cm"}
                />
                {errors?.max_dimension_unit && (
                  <span className="text-danger">
                    {errors.max_dimension_unit}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_weight"
              value={values?.has_weight || false}
              onChange={handleChange}
              label="Has Weight?"
              placeholder="Has Weight?"
            />
          </div>
          {values?.has_weight && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_weight || 0}
                  onChange={handleChange}
                  placeholder="Enter max weight"
                  name="max_weight"
                  type="number"
                  label="Max Weight"
                  error={errors?.max_weight}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingWeightUnit
                  name="weight_unit"
                  value={values?.weight_unit || ""}
                />
                {errors?.weight_unit && (
                  <span className="text-danger">{errors.weight_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_height"
              value={values?.has_height || false}
              onChange={handleChange}
              label="Has Height?"
              placeholder="Has Height?"
            />
          </div>
          {values?.has_height && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_height || 0}
                  onChange={handleChange}
                  placeholder="Enter max height"
                  name="max_height"
                  type="number"
                  label="Max Height"
                  error={errors?.max_height}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="height_unit"
                  value={values?.height_unit || ""}
                />
                {errors?.height_unit && (
                  <span className="text-danger">{errors.height_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_length"
              value={values?.has_length || false}
              onChange={handleChange}
              label="Has Length?"
              placeholder="Has Length?"
            />
          </div>
          {values?.has_length && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_length || 0}
                  onChange={handleChange}
                  placeholder="Enter max length"
                  name="max_length"
                  type="number"
                  label="Max Length"
                  error={errors?.max_length}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="length_unit"
                  value={values?.length_unit || ""}
                />
                {errors?.length_unit && (
                  <span className="text-danger">{errors.length_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_width"
              value={values?.has_width || false}
              onChange={handleChange}
              label="Has Width?"
              placeholder="Has Width?"
            />
          </div>
          {values?.has_width && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_width || 0}
                  onChange={handleChange}
                  placeholder="Enter max width"
                  name="max_width"
                  type="number"
                  label="Max Width"
                  error={errors?.max_width}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="width_unit"
                  value={values?.width_unit || ""}
                />
                {errors?.width_unit && (
                  <span className="text-danger">{errors.width_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-md-6">
            <TextInput
              value={values?.dimensional_weight_divisor || 0}
              onChange={handleChange}
              placeholder="Enter dimensional weight divisor"
              name="dimensional_weight_divisor"
              type="number"
              label="Dimensional Weight Divisor"
              error={errors?.dimensional_weight_divisor}
            />
          </div>

          <div className="col-12">
            <div className="floating-input">
              <label className="fw-bold" htmlFor="base_amount">
                Base amount
              </label>
              <CurrencyPriceInput
                amountValue={values?.base_amount || ""}
                currencyValue={values?.currency || null}
                onAmountChange={(value) => {
                  setFieldValue("base_amount", value);
                }}
                onCurrencyChange={(value) => {
                  setFieldValue("currency", value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditShippingMethodTierFields;
