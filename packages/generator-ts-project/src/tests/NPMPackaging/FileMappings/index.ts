import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { PackageFileMappingTests } from "./PackageFileMapping.test";

/**
 * Registers tests for file-mappings related to npm-packaging.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "FileMappings",
        () =>
        {
            PackageFileMappingTests(context);
        });
}
