import { basename } from "path";
import { PackageFileMappingTests } from "./PackageFileMapping.test.js";

/**
 * Registers tests for file-mappings related to npm-packaging.
 */
export function FileMappingTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            PackageFileMappingTests();
        });
}
