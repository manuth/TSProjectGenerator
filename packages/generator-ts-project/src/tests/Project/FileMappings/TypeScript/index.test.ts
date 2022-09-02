import { basename } from "path";
import { ModuleIndexFileMappingTests } from "./ModuleIndexFileMapping.test.js";
import { SuiteFileMappingTests } from "./SuiteFileMapping.test.js";
import { TestFileMappingTests } from "./TestFileMapping.test.js";

/**
 * Registers tests for the typescript file-mappings.
 */
export function TypeScriptTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ModuleIndexFileMappingTests();
            SuiteFileMappingTests();
            TestFileMappingTests();
        });
}
