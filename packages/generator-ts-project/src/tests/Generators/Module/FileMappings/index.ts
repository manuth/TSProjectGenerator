import { basename } from "path";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { NPMPackagingTests } from "./NPMPackaging/index.js";

/**
 * Registers tests for file-mappings for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            NPMPackagingTests(context);
        });
}
