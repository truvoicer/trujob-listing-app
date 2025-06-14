import { ComponentHelpers } from "@/helpers/ComponentHelpers";
import { Component } from "@fullcalendar/core";

export type SelectedListDisplayProps = {
  direction?: "horizontal" | "vertical";
  data?: Array<Record<string, any>>;
  label: string;
  render?: (
    item: Record<string, any>,
    index: number
  ) => React.ReactNode | null | string | number | boolean;
};
function SelectedListDisplay({
  data,
  label,
  direction = "horizontal",
  render = (item: Record<string, unknown>, index: number) => {
    return null;
  },
}: SelectedListDisplayProps) {
  return (
    <>
      <label className="d-block fw-bold">{label || "Selected Items"}</label>
      {data && (
        <div
          className={ComponentHelpers.buildClassName({
            "d-flex": direction === "horizontal",
            "flex-column": direction === "vertical",
            "justify-content-start": true,
            "align-items-start": direction === "vertical",
            "align-items-center": direction === "horizontal",
            "mb-3": true,
          })}
        >
          <span className="mr-2">Selected:</span>
          {data.map((item, index) => (
            <div key={index} className="d-flex flex-wrap">
              <div className="badge bg-primary-light mr-2 mb-2 text-wrap">
                {render(item, index)}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SelectedListDisplay;
