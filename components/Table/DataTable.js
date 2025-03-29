import { isNotEmpty } from "@/helpers/utils";

function DataTable({ columns = [], data = [] }) {
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
    return (
        <div className="table-responsive data-table">
            <table className="data-tables table w-100">
                <thead>
                    <tr>
                        {columns.map((column, index) => {
                            return (
                            <th key={index} className="text-center">{column?.label || ''}</th>
                        )})}
                        <th className="text-center">Action</th>
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
                                <td>
                                    <div className="d-flex align-items-center list-action">
                                        <a className="badge bg-warning-light mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Rating"
                                            href="#"><i className="far fa-star"></i></a>
                                        <a className="badge bg-success-light mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="View"
                                            href="#"><i className="lar la-eye"></i></a>
                                        <span className="badge bg-primary-light" data-toggle="tooltip" data-placement="top" title="" data-original-title="Action"
                                            href="#">
                                            <div className="dropdown">
                                                <span className="text-primary dropdown-toggle action-item" id="moreOptions1" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false" href="#">

                                                </span>
                                                <div className="dropdown-menu" aria-labelledby="moreOptions1">
                                                    <a className="dropdown-item" href="#">Edit</a>
                                                    <a className="dropdown-item" href="#">Delete</a>
                                                    <a className="dropdown-item" href="#">Hide from Contacts</a>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                </tbody>
            </table>
        </div>
    );
}
export default DataTable;