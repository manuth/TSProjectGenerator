import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TSModuleLaunchFileProcessorTests } from "./TSModuleLaunchFileProcessor.test";

/**
 * Registers tests for vscode components for `TSModule`s.
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
            TSModuleLaunchFileProcessorTests(context);
        });
}
