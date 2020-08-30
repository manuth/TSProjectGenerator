import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { NPMPackagingFileMappingTests } from "./NPMPackaging";

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
            NPMPackagingFileMappingTests(context);
        });
}
