import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../TestContext";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";
import { TSModuleGeneratorTests } from "./TSModuleGenerator.test";
import { VSCodeTests } from "./VSCode";

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
            FileMappingTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSModuleGeneratorTests(context);
        });
}
