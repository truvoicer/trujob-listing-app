import { isNotEmpty } from "@/helpers/utils";
export type DataTableColumn = {
    label?: string;
    key?: string;
    render?: null | ((column: any, item: any) => React.ReactNode | React.Component | string | number | boolean |null);
}
export type DataTableItem = {
    [key: string]: any;
}
export type DataTableProps = {
    columns?: Array<DataTableColumn>;
    data?: Array<any>;
    actions?: null | ((item: any, index: number) => React.ReactNode | React.Component | string | number | boolean |null);
}
function DataTable({
    columns = [],
    data = [],
    actions
} : DataTableProps) {
    function getValue(column: DataTableColumn, item: DataTableItem) {
        if (typeof column?.render === 'function') {
            return column.render(column, item);
        }
        if (typeof column?.key !== 'string') {
            return '';
        }
        if (!isNotEmpty(column?.key)) {
            return '';
        }
        if (item.hasOwnProperty(column.key)) {
            return item[column.key];
        }
        return '';
    }
    function renderActions(item: DataTableItem, index: number) {
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