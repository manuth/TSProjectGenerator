import { basename } from "path";
import { ModuleIndexFileMappingTests } from "./ModuleIndexFileMapping.test";
import { SuiteFileMappingTests } from "./SuiteFileMapping.test";
import { TestFileMappingTests } from "./TestFileMapping.test";

/**
 * Registers tests for the typescript file-mappings.
 */
export function TypeScriptTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            ModuleIndexFileMappingTests();
            SuiteFileMappingTests();
            TestFileMappingTests();
        });
}
