import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorExtensionsMappingTests } from "./TSGeneratorExtensionsMapping.test";

/**
 * Registers tests for the file-mappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "FileMappings",
        () =>
        {
            TSGeneratorExtensionsMappingTests(context);
        });
}
