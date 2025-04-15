import { ClassBuilder } from "@/library/ClassBuilder";

function Loader({
    fullScreen = false,
    classes = [],
}) {
    function getClasses() {
        let classData = [
            "loader-wrapper",
            "d-flex",
            "justify-content-center",
            "align-items-center",
        ];
        if (fullScreen) {
            classData.push("h-vh-100");
        }
        classData = [...classData, ...classes];
        return ClassBuilder.getInstance().buildClass(classData);
    }
    return (
        <div
            className={getClasses()}
        >
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Loader;