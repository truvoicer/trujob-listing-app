export type SelectedListDisplayProps = {
    data?: Array<Record<string, any>>;
    label: string
    render?: (item: Record<string, any>, index: number) => React.ReactNode | null | string | number | boolean
}
function SelectedListDisplay({
    data,
    label,
    render = (item, index) => {return null;}
}: SelectedListDisplayProps) {
    return (
        <>
            <label className="d-block fw-bold">
                {label || 'Selected Items'}
            </label>
            {data && (
                <div className="d-flex justify-content-start align-items-center mb-3">
                    <span className="mr-2">Selected:</span>
                    {data.map((item, index) => (
                        <div key={index} className="d-flex flex-wrap">
                            <div className="badge bg-primary-light mr-2 mb-2">
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