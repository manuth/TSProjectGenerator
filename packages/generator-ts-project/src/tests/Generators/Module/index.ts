import { basename } from "path";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../TestContext";
import { FileMappingTests } from "./FileMappings";
import { TSModuleGeneratorTests } from "./TSModuleGenerator.test";

/**
 * Registers tests for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function ModuleTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            FileMappingTests(context);
            TSModuleGeneratorTests(context);
        });
}
