import Reorder from "@/components/Reorder/Reorder";
import { useContext } from "react";
import SelectBlock from "./SelectBlock";
import SidebarForm from "../Sidebar/SidebarForm";
import SelectPaginationTypes from "./SelectPaginationType";
import SelectPaginationScrollTypes from "./SelectPaginationScrollType";
import { DataTableContext } from "@/contexts/DataTableContext";
import { PageBlock } from "@/types/PageBlock";
import { Sidebar } from "@/types/Sidebar";
import EditPageBlock from "./Block/EditPageBlock";

type PageBlockFormProps = {
    pageId?: number;
    data?: Array<PageBlock> | undefined;
    onChange: (data: any) => void;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function PageBlockForm({ pageId, data, onChange, operation }: PageBlockFormProps) {

    const dataTableContext = useContext(DataTableContext);

    const pageBlockSchema = {
        'default': false,
        'nav_title': '',
        'title': '',
        'subtitle': '',
        'background_image': '',
        'background_color': '',
        'pagination_type': '',
        'pagination': false,
        'pagination_scroll_type': '',
        'properties': [],
        'content': '',
        'has_sidebar': false,
        'sidebar_widgets': [],
        'order': 0,
    };
    
    function handleChange(values: Array<PageBlock>) {
        onChange(values);
    }

    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    itemSchema={pageBlockSchema}
                    itemHeader={(item, index) => {
                        return item?.type || 'Item type error'
                    }
                    }
                    data={data || []}
                    onChange={handleChange}
                    onAdd={({
                        reorderData,
                        onChange,
                        itemSchema
                    }) => {
                        dataTableContext.modal.show({
                            component: (
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <SelectBlock
                                            onSubmit={selectedBlock => {
                                                const newData = [...reorderData];
                                                newData.push({ ...pageBlockSchema, ...selectedBlock });
                                                onChange(newData);
                                                dataTableContext.modal.close('page-edit-block-select');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'page-edit-block-select');
                    }}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>
                            <EditPageBlock
                                pageId={pageId}
                                data={{
                                    ...item,
                                    index: index,
                                }}
                                operation={operation}
                                inModal={true}
                                modalId={'reorder-modal'}
                                index={index}
                            />
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default PageBlockForm;