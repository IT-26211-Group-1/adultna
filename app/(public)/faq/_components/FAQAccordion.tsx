import {Accordion, AccordionItem} from "@heroui/react";

export function FAQAccordion() {
    const defaultContent = (
        <p className="text-gray-600">
            This is the content of the accordion item. You can replace this with your own content.
        </p>
    );

    return (
        <section className="w-full min-h-[500px] top-10 py-16 bg-white relative flex flex-col gap-8 px-4 md:px-22 max-w-6xl text-justify">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-ultra-violet leading-tight font-playfair text-center "> FAQ Accordion Example
            </h2>
            <Accordion variant="splitted">
                <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                    {defaultContent}
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                    {defaultContent}
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                    {defaultContent}
                </AccordionItem>
            </Accordion>
        </section>
    );
}