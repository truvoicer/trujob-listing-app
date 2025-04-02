import { connect } from "react-redux";
import SessionLayout from "../Theme/Listing/SessionLayout";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import { ViewFactory } from "@/library/view/ViewFactory";
import Loader from "../Loader";
import AccessControlComponent from "../AccessControl/AccessControlComponent";

function ViewLayout({ page }) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(page);
    return (
        <>
            {view
                ? (
                    <SessionLayout>
                        {view}
                    </SessionLayout>
                )
                : <Loader fullScreen />
            }
        </>
    );
}
export default connect(
    state => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);