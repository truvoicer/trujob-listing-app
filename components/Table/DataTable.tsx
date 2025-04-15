import { isNotEmpty } from "@/helpers/utils";

function DataTable({
    columns = [],
    data = [],
    actions = null
}) {
    function getValue(column, item) {
        if (typeof column?.render === 'function') {
            return column.render(column, item);
        }
        if (!isNotEmpty(column?.key)) {
            return '';
        }
        if (item.hasOwnProperty(column.key)) {
            return item[column.key];
        }
        return '';
    }
    function renderActions(item, index) {
        if (actions && typeof actions === 'function') {
            return actions(item, index);
        }
        return null;
    }
    
    return (
        <div className="table-responsive data-table">
            <table className="data-tables table w-100">
                <thead>
                    <tr>
                        {columns.map((column, index) => {
                            return (
                                <th key={index} className="text-center">{column?.label || ''}</th>
                            )
                        })}
                        {typeof actions === 'function' && (
                            <th className="text-center">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={index}>
                                {columns.map((column, index) => {
                                    return (
                                        <td
                                            key={index}
                                            className="text-center">
                                            {getValue(column, item)}
                                        </td>
                                    );
                                })}
                                {typeof actions === 'function' && (
                                    <td>
                                        {renderActions(item, index)}
                                    </td>
                                )}
                            </tr>
                        );
                    })}

                </tbody>
            </table>
        </div>
    );
}
export default DataTable;