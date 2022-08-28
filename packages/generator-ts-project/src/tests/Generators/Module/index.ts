import { basename } from "path";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator.js";
import { TestContext } from "../../TestContext.js";
import { FileMappingTests } from "./FileMappings/index.js";
import { TSModuleGeneratorTests } from "./TSModuleGenerator.test.js";

/**
 * Registers tests for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function ModuleTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            FileMappingTests(context);
            TSModuleGeneratorTests(context);
        });
}
