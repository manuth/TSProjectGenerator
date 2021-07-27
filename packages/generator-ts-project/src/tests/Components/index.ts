import { basename } from "path";
import { InquiryTests } from "./Inquiry";
import { JSONCreatorMappingTests } from "./JSONCCreatorMapping.test";
import { TransformationTests } from "./Transformation";
import { YAMLCreatorMappingTests } from "./YAMLCreatorMapping.test";

/**
 * Registers tests for components.
 */
export function ComponentTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            InquiryTests();
            TransformationTests();
            JSONCreatorMappingTests();
            YAMLCreatorMappingTests();
        });
}
