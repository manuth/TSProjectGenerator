import { basename } from "path";
import { PackageFileMappingTests } from "./PackageFileMapping.test";

/**
 * Registers tests for file-mappings related to npm-packaging.
 */
export function FileMappingTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            PackageFileMappingTests();
        });
}
