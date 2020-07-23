import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { NPMPackagingTests } from "./NPMPackaging";
import { VSCodeTests } from "./VSCode";

/**
 * Registers tests for file-mappings for the `TSModule` generator.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "FileMappings",
        () =>
        {
            NPMPackagingTests(context);
            VSCodeTests(context);
        });
}
