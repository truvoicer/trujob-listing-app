export type ButtonLinkProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEventHandler<HTMLButtonElement>) => void;
};
function ButtonLink({
  children,
  className = "btn-primary",
  href = "#",
  onClick,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`btn mr-3 px-4 btn-calendify ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default ButtonLink;
