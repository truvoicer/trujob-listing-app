import { Core } from '@/library/services/core/Core';
import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../contexts/ListingsContext';

function RadiusFilterWidget(props) {
    const [radius, setRadius] = useState('');

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
