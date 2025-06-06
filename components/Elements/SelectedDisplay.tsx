export type SelectedDisplayProps = {
    data?: Record<string, any>;
    label: string;
    render?: (item: Record<string, any>) => React.ReactNode | null | string | number | boolean;
}
function SelectedDisplay({
    data,
    label,
    render = (item) => { return null; },
}: SelectedDisplayProps) {
    return (
        <>
            <label className="d-block fw-bold">
                {label || 'Selected Item'}
            </label>
            {data && (
                <div className="d-flex justify-content-start align-items-center mb-3">
                    <span className="mr-2">Selected:</span>
                    <div className="d-flex flex-wrap">
                        <div className="badge bg-primary-light mr-2 mb-2">
                            {render(data)}
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}

export default SelectedDisplay;