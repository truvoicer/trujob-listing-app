function Checkout() {
    return (
        <div className="container-fluid container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card card-block card-stretch card-height print rounded">
                        <div className="card-header d-flex justify-content-between bg-primary header-invoice">
                            <div className="iq-header-title">
                                <h4 className="card-title mb-0">Invoice#1234567</h4>
                            </div>
                            <div className="invoice-btn">
                                <button
                                    type="button"
                                    className="btn btn-primary-dark mr-2">
                                    <i className="las la-print"></i>
                                    Print
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary-dark">
                                    <i className="las la-file-download"></i>
                                    PDF
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <img
                                        src="../assets/images/logo.png"
                                        className="logo-invoice img-fluid mb-3" />
                                    <h5 className="mb-0">Hello, Barry Techs</h5>
                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at
                                        its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
                                        opposed to using 'Content here, content here', making it look like readable English.</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Order Date</th>
                                                    <th scope="col">Order Status</th>
                                                    <th scope="col">Order ID</th>
                                                    <th scope="col">Billing Address</th>
                                                    <th scope="col">Shipping Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Jan 17, 2016</td>
                                                    <td><span className="badge badge-danger">Unpaid</span></td>
                                                    <td>250028</td>
                                                    <td>
                                                        <p className="mb-0">PO Box 16122 Collins Street West<br />Victoria 8007 Australia<br />
                                                            Phone: +123 456 7890<br />
                                                            Email: demo@Server360.com<br />
                                                            Web: www.Server360.com
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0">PO Box 16122 Collins Street West<br />Victoria 8007 Australia<br />
                                                            Phone: +123 456 7890<br />
                                                            Email: demo@Server360.com<br />
                                                            Web: www.Server360.com
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5 className="mb-3">Order Summary</h5>
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="text-center" scope="col">#</th>
                                                    <th scope="col">Item</th>
                                                    <th className="text-center" scope="col">Quantity</th>
                                                    <th className="text-center" scope="col">Price</th>
                                                    <th className="text-center" scope="col">Totals</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th className="text-center" scope="row">1</th>
                                                    <td>
                                                        <h6 className="mb-0">Web Design</h6>
                                                        <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        </p>
                                                    </td>
                                                    <td className="text-center">5</td>
                                                    <td className="text-center">$120.00</td>
                                                    <td className="text-center"><b>$2,880.00</b></td>
                                                </tr>
                                                <tr>
                                                    <th className="text-center" scope="row">2</th>
                                                    <td>
                                                        <h6 className="mb-0">Web Design</h6>
                                                        <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        </p>
                                                    </td>
                                                    <td className="text-center">5</td>
                                                    <td className="text-center">$120.00</td>
                                                    <td className="text-center"><b>$2,880.00</b></td>
                                                </tr>
                                                <tr>
                                                    <th className="text-center" scope="row">3</th>
                                                    <td>
                                                        <h6 className="mb-0">Web Design</h6>
                                                        <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        </p>
                                                    </td>
                                                    <td className="text-center">5</td>
                                                    <td className="text-center">$120.00</td>
                                                    <td className="text-center"><b>$2,880.00</b></td>
                                                </tr>
                                                <tr>
                                                    <th className="text-center" scope="row">4</th>
                                                    <td>
                                                        <h6 className="mb-0">Web Design</h6>
                                                        <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        </p>
                                                    </td>
                                                    <td className="text-center">5</td>
                                                    <td className="text-center">$120.00</td>
                                                    <td className="text-center"><b>$2,880.00</b></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <b className="text-danger">Notes:</b>
                                    <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page
                                        when looking
                                        at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
                                        as opposed to using 'Content here, content here', making it look like readable English.</p>
                                </div>
                            </div>
                            <div className="row mt-4 mb-3">
                                <div className="offset-lg-8 col-lg-4">
                                    <div className="or-detail rounded">
                                        <div className="p-3">
                                            <h5 className="mb-3">Order Details</h5>
                                            <div className="mb-2">
                                                <h6>Bank</h6>
                                                <p>Threadneedle St</p>
                                            </div>
                                            <div className="mb-2">
                                                <h6>Acc. No</h6>
                                                <p>12333456789</p>
                                            </div>
                                            <div className="mb-2">
                                                <h6>Due Date</h6>
                                                <p>12 August 2020</p>
                                            </div>
                                            <div className="mb-2">
                                                <h6>Sub Total</h6>
                                                <p>$4597.50</p>
                                            </div>
                                            <div>
                                                <h6>Discount</h6>
                                                <p>10%</p>
                                            </div>
                                        </div>
                                        <div className="ttl-amt py-2 px-3 d-flex justify-content-between align-items-center">
                                            <h6>Total</h6>
                                            <h3 className="text-primary font-weight-700">$4137.75</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;