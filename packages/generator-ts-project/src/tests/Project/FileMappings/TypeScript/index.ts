import { basename } from "path";
import { ModuleIndexFileMappingTests } from "./ModuleIndexFileMapping.test";

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
        });
}
