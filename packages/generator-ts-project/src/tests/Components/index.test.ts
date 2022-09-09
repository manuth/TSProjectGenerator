import { basename } from "node:path";
import { DumpCreatorFileMappingTests } from "./DumpCreatorFileMapping.test.js";
import { InquiryTests } from "./Inquiry/index.test.js";
import { TransformationTests } from "./Transformation/index.test.js";
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
