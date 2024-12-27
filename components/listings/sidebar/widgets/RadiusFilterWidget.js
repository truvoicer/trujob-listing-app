import React from 'react';

function RadiusFilterWidget(props) {
    return (
        <form action="#" method="post">
            <div className="form-group">
                <p>Radius around selected destination</p>
            </div>
            <div className="form-group">
                <input type="range" min="0" max="100" value="20" data-rangeslider/>
            </div>
        </form>
    );
}

export default RadiusFilterWidget;
