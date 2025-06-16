import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

export interface AccordionItem {
  key: string;
  header: string;
  body: React.ReactNode;
  open?: boolean;
}

interface DynamicAccordionProps {
  items: AccordionItem[];
}

export const DynamicAccordion: React.FC<DynamicAccordionProps> = ({
  items,
}) => {
  const [activeKey, setActiveKey] = useState<string | null | string[]>(null);

  const handleToggle = (key: string) => {
    setActiveKey((prevKey) => (prevKey === key ? null : key));
  };
  function renderBody(item: AccordionItem) {
    if (activeKey === item.key) {
      return item.body;
    }
    if (Array.isArray(activeKey) && activeKey.includes(item.key)) {
      return item.body;
    }
    return null;
  }
  useEffect(() => {
    const filterOpenItems: string[] = items
      .map((item) => (item.open ? item.key : null))
      .filter(Boolean) as string[];
      
    if (filterOpenItems.length > 0) {
      setActiveKey(filterOpenItems);
    }
  }, [items]);
  return (
    <Accordion
      activeKey={activeKey}
      onSelect={(key) => handleToggle(key as string)}
    >
      {items.map((item) => (
        <Accordion.Item eventKey={item.key} key={item.key}>
          <Accordion.Header>{item.header}</Accordion.Header>
          <Accordion.Body>{renderBody(item)}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default DynamicAccordion;
