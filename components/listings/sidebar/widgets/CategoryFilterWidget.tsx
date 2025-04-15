import { Core } from '@/library/services/core/Core';
import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../contexts/ListingsContext';

function CategoryFilterWidget(props) {
    const [categories, setCategories] = useState([]);

    const listingsService = Core.getInstance().getListingsService(useContext(ListingsContext));

    function updateRequest(key, value) {
        listingsService.getContextService().updateContext({
            query: {
                ...listingsService.contextService.context.query,
                [key]: value,
            }
        });
    }

    function handleChanges(e) {
        const { target } = e;
        const { id, checked } = target;
        if (checked) {
            setCategories([...categories, id]);
        } else {
            setCategories(categories.filter(category => category !== id));
        }
    }

    useEffect(() => {
        if (categories.length === 0) {
            return;
        }
        updateRequest('categories', categories);
    }, [categories]);

    return (
        <div className="mb-5">
            <form action="#" method="post">
                <div className="form-group">
                    <p>More filters</p>
                </div>
                <div className="form-group">
                    <ul className="list-unstyled">
                        <li>
                            <label htmlFor="residential">
                                <input type="checkbox" id="residential" value="residential" onChange={handleChanges} />
                                Residential
                            </label>
                        </li>
                        <li>
                            <label htmlFor="commercial">
                                <input type="checkbox" id="commercial" value="commercial" onChange={handleChanges} />
                                Commercial
                            </label>
                        </li>
                        <li>
                            <label htmlFor="industrial">
                                <input type="checkbox" id="industrial" value="industrial" onChange={handleChanges} />
                                Industrial
                            </label>
                        </li>
                        <li>
                            <label htmlFor="land">
                                <input type="checkbox" id="land" value="land" onChange={handleChanges} />
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
