import { Core } from '@/library/services/core/Core';
import React, { use, useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../contexts/ListingsContext';

function SearchFilterWidget(props) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const listingsService = Core.getInstance().getListingsService(useContext(ListingsContext));

    function handleChanges(key, value) {
        listingsService.getContextService().updateContext({
            query: {
                ...listingsService.contextService.context.query,
                [key]: value,
            }
        });
    }

    useEffect(() => {
        if (!search || search === '') {
            return;
        }
        handleChanges('search', search);
    }, [search]);

    useEffect(() => {
        if (!category || category === '') {
            return;
        }
        handleChanges('category', category);
    }, [category]);

    useEffect(() => {
        if (!location || location === '') {
            return;
        }
        handleChanges('location', location);
    }, [location]);

    
    return (
        <form action="#" method="post">
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="What are you looking for?" 
                    className="form-control"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="form-group">
                <div className="select-wrap">
                    <span className="icon"><span className="icon-keyboard_arrow_down"></span></span>
                    <select 
                        className="form-control" 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="real_estate">Real Estate</option>
                        <option value="books_and_magazines">Books &amp;  Magazines</option>
                        <option value="furniture">Furniture</option>
                        <option value="electronics">Electronics</option>
                        <option value="cars_and_vehicles">Cars &amp; Vehicles</option>
                        <option value="others">Others</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <div className="wrap-icon">
                    <span className="icon icon-room"></span>
                    <input 
                        type="text" 
                        placeholder="Location" 
                        className="form-control"
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>
        </form>
    );
}

export default SearchFilterWidget;
