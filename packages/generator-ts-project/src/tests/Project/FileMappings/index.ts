import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { NPMIgnoreFileMappingTests } from "./NPMIgnoreFileMapping.test";
import { NPMPackagingTests } from "./NPMPackaging";

/**
 * Registers tests for file-mappings for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "FileMappings",
        () =>
        {
            NPMIgnoreFileMappingTests(context);
            NPMPackagingTests(context);
        });
}
