import { BlockContext, blockContextData } from "@/contexts/BlockContext";
import { useEffect, useRef, useState } from "react";

function BlockComponent(props) {
    const { component, className = '', ...otherProps } = props;
    if (!component) {
        return null;
    }
    const Component = component;
    const blockProps = props || {};

    const [blockConTextState, setBlockContextState] = useState({
        ...blockContextData,
        first_block: props?.firstBlock || false,
        last_block: props?.lastBlock || false,
    });
    const [blockLoaded, setBlockLoaded] = useState(false);

    const blockRef = useRef(null);

    function getBlockProps() {
        let blockProps = {
            ref: blockRef,
        };
        if (props?.firstBlock) {
            blockProps = {
                ...blockProps,
                className: className,
            }
        }

        return blockProps;
    }

    useEffect(() => {
        setBlockContextState({
            ref: blockRef,
            ...blockProps,
        });
        setBlockLoaded(true);
    }, [blockRef]);

    return (
        <BlockContext.Provider value={blockConTextState}>
            {blockLoaded
                ? (
                    <div {...getBlockProps()}>
                        {(typeof component !== 'undefined' && component !== null)
                            ? <Component {...blockProps} />
                            : null
                        }
                    </div>
                )
                : null
            }
        </BlockContext.Provider>
    );
}

export default BlockComponent;