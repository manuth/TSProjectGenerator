import { TestContext } from "@manuth/extended-yo-generator-test";
import TSModuleGenerator = require("../../../../../generators/module");
import { TSModuleLaunchFileMappingTests } from "./TSModuleLaunchFileMapping.test";

/**
 * Registers tests for `VSCode` filemappings for the `TSModule` generator.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSModuleLaunchFileMappingTests(context);
        });
}
