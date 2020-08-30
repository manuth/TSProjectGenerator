import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../TestContext";
import { NPMPackagingTests } from "./NPMPackaging";

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
        });
}
