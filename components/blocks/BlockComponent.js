import { BlockContext, blockContextData } from "@/contexts/BlockContext";
import { useEffect, useRef, useState } from "react";

function BlockComponent(props) {
    const { component, ...otherProps } = props;
    if (!component) {
        return null;
    }
    const Component = component;
    const blockProps = props || {};

    const [blockConTextState, setBlockContextState] = useState({
        ...blockContextData
    });
    const blockRef = useRef(null);

    function getBlockProps() {
        let blockProps = {
            ref: blockRef,
            ...otherProps,
        };
        return blockProps;
    }

    useEffect(() => {
        setBlockContextState({
            ref: blockRef,
            ...blockProps,
        });
    }, [blockRef]);

    return (
        <BlockContext.Provider value={blockConTextState}>
            <div {...getBlockProps()}>
                {(typeof component !== 'undefined' && component !== null)
                    ? <Component {...blockProps} />
                    : null
                }
            </div>
        </BlockContext.Provider>
    );
}

export default BlockComponent;