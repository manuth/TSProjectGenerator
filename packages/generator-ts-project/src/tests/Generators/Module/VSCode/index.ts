import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../TestContext";
import { TSModuleLaunchSettingsProcessorTests } from "./TSModuleLaunchSettingsProcessor.test";

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
            TSModuleLaunchSettingsProcessorTests(context);
        });
}
