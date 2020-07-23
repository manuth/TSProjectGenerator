import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator";
import { ComponentTests } from "./Components";

/**
 * Registers tests for the `TSModuleGenerator`.
 *
 * @param context
 * The test-context.
 */
export function ModuleTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "Module",
        () =>
        {
            ComponentTests(context);
        });
}
