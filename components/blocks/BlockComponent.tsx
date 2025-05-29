import { BlockContext, blockContextData } from "@/contexts/BlockContext";
import { useEffect, useRef, useState } from "react";
import AccessControlComponent from "../AccessControl/AccessControlComponent";

function BlockComponent(props: any) {
    const { component, className = '', roles, has_permission, ...otherProps } = props;
    if (!component) {
        return null;
    }
    const Component = component;
    let blockProps = props || {};
    if (typeof component?.defaultProps === 'object') {
        blockProps = {
            ...blockProps,
            ...component?.defaultProps,
        }
    }

    const [blockContextState, setBlockContextState] = useState({
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
        <AccessControlComponent
        id={props?.id || 'block-component'}
        roles={roles}
        >
            <BlockContext.Provider value={blockContextState}>
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
        </AccessControlComponent>
    );
}

export default BlockComponent;