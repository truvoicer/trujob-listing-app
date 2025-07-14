export type BadgeProps = {
  count: number;
  text: string;
  bgColor?:
    | "primary-light"
    | "secondary-light"
    | "success-light"
    | "danger-light"
    | "warning-light"
    | "info-light"
    | "dark-light"
    | "primary-dark"
    | "secondary-dark"
    | "success-dark"
    | "danger-dark"
    | "warning-dark"
    | "info-dark";
  textColor?: string;
  badgeBgColor?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info";
  badgeTextColor?: string;
};
function BadgeWithCount({
  count,
  text,
  bgColor,
  textColor,
  badgeBgColor,
  badgeTextColor,
}: BadgeProps) {
  function renderSpan() {
    return (
      <span
        className={`badge badge-${badgeBgColor || "primary"} ml-2`}
        style={{ color: badgeTextColor || "#000" }}
      >
        {count}
      </span>
    );
  }
  return (
    <button
      className={`btn mb-1 bg-${bgColor || "primary-light"}`}
      style={{ color: textColor || "#000" }}
    >
      {text} {count && renderSpan()}
    </button>
  );
}

export default BadgeWithCount;