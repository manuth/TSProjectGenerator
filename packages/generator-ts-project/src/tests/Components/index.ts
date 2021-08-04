import { basename } from "path";
import { DumpCreatorFileMappingTests } from "./DumpCreatorFileMapping.test";
import { InquiryTests } from "./Inquiry";
import { TransformationTests } from "./Transformation";

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
            DumpCreatorFileMappingTests();
        });
}
