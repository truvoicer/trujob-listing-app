import { APP_MODE } from "@/library/redux/constants/app-constants";
import Link from "next/link";
import { connect } from "react-redux";

export type BrandingProps = {
    app: any;
};
function Branding({
    app,
}: BrandingProps) {
    return (
        <Link
            href={'/admin/dashboard'}
            className="header-logo"
        >
            <img src="/images/logo.png"
                className={`img-fluid rounded-normal light-logo ${app[APP_MODE] === 'dark' ? 'd-none' : ''}`}
                alt="logo" />
            <img src="/images/logo-white.png"
                className={`img-fluid rounded-normal darkmode-logo ${app[APP_MODE] === 'light' ? 'd-none' : ''}`}
                alt="logo" />
        </Link>
    );
}

export default connect(
    (state: any) => ({
        app: state.app,
    }),
)(Branding);