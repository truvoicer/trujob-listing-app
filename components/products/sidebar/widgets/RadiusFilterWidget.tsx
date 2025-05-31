import { Core } from '@/library/services/core/Core';
import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../../contexts/ProductsContext';

function RadiusFilterWidget(props) {
    const [radius, setRadius] = useState('');

    const productsService = Core.getInstance().getProductsService(useContext(ProductsContext));

    function handleChanges(key, value) {
        productsService.getContextService().updateContext({
            query: {
                ...productsService.contextService.context.query,
                [key]: value,
            }
        });
    }

    useEffect(() => {
        if (!radius || radius === '') {
            return;
        }
        handleChanges('radius', radius);
    }, [radius]);

    return (
        <form action="#" method="post">
            <div className="form-group">
                <p>Radius around selected destination</p>
            </div>
            <div className="form-group">
                <input type="range" min="0" max="100" onChange={e => setRadius(e.target.value)} />
            </div>
        </form>
    );
}

export default RadiusFilterWidget;
