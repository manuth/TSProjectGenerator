import { basename } from "path";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../TestContext";
import { NPMPackagingTests } from "./NPMPackaging";

/**
 * Registers tests for file-mappings for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            NPMPackagingTests(context);
        });
}
