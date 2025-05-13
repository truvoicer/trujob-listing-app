import { isNotEmpty } from "@/helpers/utils";
import { useContext, useEffect, useState } from "react";
import Pagination from "../listings/Pagination";
import { DataTableContext } from "@/contexts/DataTableContext";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type DataTableColumn = {
    label?: string;
    key?: string;
    render?: null | ((column: any, item: any) => React.ReactNode | React.Component | string | number | boolean | null);
}
export type DataTableItem = {
    [key: string]: any;
}
export type OnRowSelectActionClick = ({
    action: any,
    data: Array<any>
});
export type DataTableProps = {
    onChange: (tableData: Array<any>) => void;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    enableEdit?: boolean;
    onRowSelectActionClick?: ({ action, data }: OnRowSelectActionClick) => void;
    rowSelectActions?: Array<any>
    onRowSelect?: (item: DataTableItem, index: number) => void;
    multiRowSelection?: boolean;
    rowSelection?: boolean;
    columns?: Array<DataTableColumn>;
    data?: Array<any>;
    actionColumn?: null | ((item: any, index: number) => React.ReactNode | React.Component | string | number | boolean | null);
}
function DataTable({
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true,
    onRowSelectActionClick,
    rowSelectActions = [],
    multiRowSelection = false,
    rowSelection = false,
    columns = [],
    data = [],
    actionColumn
}: DataTableProps) {
    const [tableData, setTableData] = useState<Array<any>>(data);

    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const dataTableContext = useContext(DataTableContext);

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
                    return {
                        ...item,
                        index,
                        checked: false,
                    };
                })
            );
        } else {

            setTableData([]);
        }
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
                            name="DataTables_Table_0_length"
                            aria-controls="DataTables_Table_0"
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
                            DebugHelpers.log(DebugHelpers.DEBUG, 'Page Clicked', page);
                        }} />
                </div>
            </div>
        </>
    );
}
export default DataTable;