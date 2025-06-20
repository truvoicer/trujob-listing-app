import { findInObject, isNotEmpty } from "@/helpers/utils";
import { useContext, useEffect, useState } from "react";
import Pagination from "../products/Pagination";
import { DataTableContext } from "@/contexts/DataTableContext";
import moment from "moment";

export const DEFAULT_DATE_FORMAT = 'Do MMMM YYYY h:mm:ss a';
export type DataTableColumn = {
    type?: 'string' | 'number' | 'date' | 'boolean' | 'object';
    date_format?: string; // e.g. 'YYYY-MM-DD HH:mm:ss'
    label?: string;
    key?: string;
    render?: null | ((column: DataTableColumn, item: Record<string, unknown>) => React.ReactNode | React.Component | string | number | boolean | null);
}
export type DataTableItem = {
    [key: string]: unknown;
}
export type OnRowSelectActionClick = ({
    action: unknown,
    data: Array<unknown>
});
export type DataTableProps = {
    onChange: (tableData: Array<Record<string, unknown>>) => void;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    enableEdit?: boolean;
    onRowSelectActionClick?: ({ action, data }: OnRowSelectActionClick) => void;
    rowSelectActions?: Array<unknown>
    onRowSelect?: (item: DataTableItem, index: number) => boolean | Promise<boolean>;
    multiRowSelection?: boolean;
    rowSelection?: boolean;
    columns?: Array<DataTableColumn>;
    data?: Array<Record<string, unknown>>;
    actionColumn?: null | ((item: Record<string, unknown>, index: number) => React.ReactNode | React.Component | string | number | boolean | null);
}
function DataTable({
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true,
    onRowSelect,
    onRowSelectActionClick,
    rowSelectActions = [],
    multiRowSelection = false,
    rowSelection = false,
    columns = [],
    data = [],
    actionColumn
}: DataTableProps) {
    const [tableData, setTableData] = useState<Array<Record<string, unknown>>>(data);

    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const dataTableContext = useContext(DataTableContext);

    function getValueByColumnType(column: DataTableColumn, value: unknown) {
        switch (column?.type) {
            case 'date':
                let format = DEFAULT_DATE_FORMAT;
                if (column?.date_format && typeof column.date_format === 'string') {
                    format = column.date_format;
                }
                if (typeof value === 'string' || typeof value === 'number') {
                    return moment(value).format(format);
                }
                return '';
            case 'boolean':
                if (typeof value === 'boolean') {
                    return value ? 'Yes' : 'No';
                }
                return '';
            case 'object':
                if (typeof value === 'object' && value !== null) {
                    return JSON.stringify(value);
                }
                return '';
            case 'string':
            case 'number':
                return value || '';
            default:
                return formatValue(column, value);
        }
    }

    function formatValue(column: DataTableColumn, value: unknown) {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return '';
    }

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
        let value;
        if (column?.key.includes('.')) {
            value = findInObject(column.key, item);
        }
        if (item.hasOwnProperty(column.key)) {
            value = item[column.key];
        }
        if (column?.type) {
            return getValueByColumnType(column, value);
        }   
        return formatValue(column, value);
    }
    function renderActionColumn(item: DataTableItem, index: number) {
        if (actionColumn && typeof actionColumn === 'function') {
            return actionColumn(item, index);
        }
        return null;
    }
    function handleCheckAll(e: React.ChangeEvent<HTMLInputElement>) {
        const checked = e.target.checked;
        const newTableData = tableData.map((item) => {
            return {
                ...item,
                checked: checked,
            };
        });
        setTableData(newTableData);
        if (typeof onChange === 'function') {
            onChange(newTableData);
        }

    }
    function initTableData() {
        if (Array.isArray(data) && data.length > 0) {
            setTableData(
                data.map((item: any, index: number) => {
                    let checked = false;
                    if (item.hasOwnProperty('checked')) {
                        checked = item.checked;
                    }
                    return {
                        ...item,
                        index,
                        checked,
                    };
                })
            );
        } else {

            setTableData([]);
        }
    }

    function handleRowSelect(item: DataTableItem, index: number): boolean| Promise<boolean> {
        if (typeof onRowSelect !== 'function') {
            return true;
        }
        return onRowSelect(item, index);
    }

    function renderRowSelectActions() {
        return (
            <div className="floating-input form-group">
                <select
                    id={'actions'}
                    className="form-control"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectedAction(e.target.value);
                    }}
                    value={selectedAction || ''}
                >
                    <option value="">Select Action</option>
                    {rowSelectActions.map((action, index) => (
                        <option
                            key={index}
                            value={action.name}>
                            {`${action.label}`}
                        </option>
                    ))}
                </select>
                <label className="form-label" htmlFor={'actions'}>
                    Actions
                </label>
            </div>
        );
    }

    useEffect(() => {
        initTableData();
    }, [data]);

    useEffect(() => {
        const findAction = rowSelectActions.find((action) => action?.name === selectedAction);
        if (!findAction) {
            return;
        }

        if (typeof onRowSelectActionClick === 'function') {
            onRowSelectActionClick({
                action: findAction,
                data: tableData.filter((item) => item.checked),
            });
            return;
        }
        if (typeof findAction?.onClick === 'function') {
            findAction.onClick({
                action: findAction,
                data: tableData.filter((item) => item.checked),
            });
        }
    }, [selectedAction]);
    
    return (
        <>
            <div className="row">
                {enableEdit && (
                    <div className="col-sm-12 col-md-3">
                        {renderRowSelectActions()}
                    </div>
                )}
                <div className="col-sm-12 col-md-3">
                    <label className="mb-0">
                        Show
                        <select
                            name="entries"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const limit = parseInt(e.target.value, 10);
                                if (dataTableContext && typeof dataTableContext.update === 'function') {
                                    dataTableContext.update({
                                        query: {
                                            ...dataTableContext.query,
                                            limit: limit,
                                        },
                                    });
                                }
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        entries
                    </label>
                </div>
                <div className="col-sm-12 col-md-6">
                    <div className="iq-search-bar search-device ml-auto mb-0 ">
                        <form action="#" className="searchbox">
                            <input
                                type="text"
                                className="text search-input w-auto"
                                placeholder="Search..."
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (dataTableContext && typeof dataTableContext.update === 'function') {
                                        dataTableContext.update({
                                            query: {
                                                ...dataTableContext.query,
                                                query: e.target.value,
                                            },
                                        });
                                    }
                                }}
                            />
                        </form>
                    </div>
                </div>
            </div>
            <div className="table-responsive data-table">
                <table className="data-tables table w-100">
                    <thead>
                        <tr>
                            {rowSelection && (
                                <th className="text-center">
                                    {multiRowSelection && (
                                        <input
                                            type="checkbox"
                                            onChange={handleCheckAll}
                                        />
                                    )}
                                </th>
                            )}
                            {columns.map((column, index) => {
                                return (
                                    <th key={index} className="text-center">{column?.label || ''}</th>
                                )
                            })}
                            {enableEdit && typeof actionColumn === 'function' && (
                                <th className="text-center">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {rowSelection && multiRowSelection && (
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={item?.checked || false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const checked = e.target.checked;

                                                    let newState = [...tableData];
                                                    if (typeof newState?.[index] === 'undefined') {
                                                        return newState;
                                                    }
                                                    newState[index] = {
                                                        ...newState[index],
                                                        checked: checked,
                                                    };
                                                    const rowSelect = handleRowSelect(newState[index], index);
                                                    if (!rowSelect) {
                                                        return;
                                                    }
                                                    setTableData(newState);
                                                    if (typeof onChange === 'function') {
                                                        onChange(newState);
                                                    }
                                                }}
                                            />
                                        </td>
                                    )}
                                    {rowSelection && !multiRowSelection && (
                                        <td className="text-center">
                                            <input
                                                type="radio"
                                                checked={item?.checked || false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const checked = e.target.checked;
                                                    let newState = [...tableData];
                                                    newState = newState.map((item, tableDataItemIndex) => {
                                                        return {
                                                            ...item,
                                                            checked: tableDataItemIndex === index ? checked : false,
                                                        };
                                                    });
                                                    const rowSelect = handleRowSelect(newState[index], index);
                                                    if (!rowSelect) {
                                                        return;
                                                    }
                                                    setTableData(newState);
                                                    if (typeof onChange === 'function') {
                                                        onChange(newState);
                                                    }
                                                }}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column, index) => {
                                        return (
                                            <td
                                                key={index}
                                                className="text-center">
                                                {getValue(column, item)}
                                            </td>
                                        );
                                    })}
                                    {enableEdit && typeof actionColumn === 'function' && (
                                        <td>
                                            {renderActionColumn(item, index)}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
            <div className="row">
                {enableEdit && (
                    <div className="col-sm-12 col-md-3">
                        {renderRowSelectActions()}
                    </div>
                )}
                <div className="col-sm-12 col-md-3">
                    <Pagination
                        paginationMode={paginationMode}
                        data={dataTableContext?.meta}
                        showIndicator={true}
                        onPageClick={(e, page) => {
                            dataTableContext.update({
                                query: {
                                    ...dataTableContext.query,
                                    page: page,
                                },
                            })
                        }} />
                </div>
            </div>
        </>
    );
}
export default DataTable;