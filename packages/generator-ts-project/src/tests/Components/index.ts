import { basename } from "path";
import { DumpCreatorFileMappingTests } from "./DumpCreatorFileMapping.test.js";
import { InquiryTests } from "./Inquiry/index.js";
import { TransformationTests } from "./Transformation/index.js";
import { TypeScriptCreatorMappingTests } from "./TypeScriptCreatorMapping.test.js";

/**
 * Registers tests for components.
 */
export function ComponentTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            InquiryTests();
            TransformationTests();
            DumpCreatorFileMappingTests();
            TypeScriptCreatorMappingTests();
        });
}
