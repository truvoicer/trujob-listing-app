import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import { SITE_STATE } from "@/library/redux/constants/site-constants";
import Link from "next/link";
import { connect } from "react-redux";
import ImageLoader from "../Media/Image/ImageLoader";

function Branding({ site, settings }) {
    return (
        <Link href="/" className="text-white mb-0">
            <ImageLoader
                category={'logo'}
                media={site?.media}
                fallback={() => {
                    return (
                        <h1 className="mb-0 site-logo">
                            {site?.title || ''}
                        </h1>
                    );
                }}
            />
        </Link>
    );
}
export default connect(
    state => ({
        site: state[SITE_STATE],
        settings: state[SETTINGS_STATE]
    })
)(Branding);