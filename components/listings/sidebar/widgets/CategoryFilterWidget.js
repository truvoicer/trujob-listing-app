import React from 'react';

function CategoryFilterWidget(props) {
    return (
        <div className="mb-5">
            <form action="#" method="post">
                <div className="form-group">
                    <p>More filters</p>
                </div>
                <div className="form-group">
                    <ul className="list-unstyled">
                        <li>
                            <label htmlFor="option1">
                                <input type="checkbox" id="option1"/>
                                Residential
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option2">
                                <input type="checkbox" id="option2"/>
                                Commercial
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option3">
                                <input type="checkbox" id="option3"/>
                                Industrial
                            </label>
                        </li>
                        <li>
                            <label htmlFor="option4">
                                <input type="checkbox" id="option4"/>
                                Land
                            </label>
                        </li>
                    </ul>
                </div>
            </form>
        </div>
    );
}

export default CategoryFilterWidget;
