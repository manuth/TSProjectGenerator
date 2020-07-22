import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorExtensionsMappingTests } from "./TSGeneratorExtensionsMapping.test";
import { TSGeneratorLaunchFileMappingTests } from "./TSGeneratorLaunchFileMapping.test";

/**
 * Registers tests for the VSCode file-mappings.
 *
 * @param context
 * The test-context.
 */
export function VSCodeFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSGeneratorExtensionsMappingTests(context);
            TSGeneratorLaunchFileMappingTests(context);
        });
}
