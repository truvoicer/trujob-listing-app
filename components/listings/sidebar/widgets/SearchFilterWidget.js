import React from 'react';

function SearchFilterWidget(props) {
    return (
        <form action="#" method="post">
            <div className="form-group">
                <input type="text" placeholder="What are you looking for?" className="form-control"/>
            </div>
            <div className="form-group">
                <div className="select-wrap">
                    <span className="icon"><span className="icon-keyboard_arrow_down"></span></span>
                    <select className="form-control" name="" id="">
                        <option value="">All Categories</option>
                        <option value="" selected="">Real Estate</option>
                        <option value="">Books &amp;  Magazines</option>
                        <option value="">Furniture</option>
                        <option value="">Electronics</option>
                        <option value="">Cars &amp; Vehicles</option>
                        <option value="">Others</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <div className="wrap-icon">
                    <span className="icon icon-room"></span>
                    <input type="text" placeholder="Location" className="form-control"/>
                </div>
            </div>
        </form>
    );
}

export default SearchFilterWidget;
