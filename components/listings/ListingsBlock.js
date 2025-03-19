import React, { useContext, useEffect } from 'react';
import ListingsGrid from './grid/ListingsGrid';
import ListingsContainer from './ListingsContainer';

function ListingsBlock(props) {
    return (
        <ListingsContainer>
            <ListingsGrid {...props} />
        </ListingsContainer>
    );
}

export default ListingsBlock;
