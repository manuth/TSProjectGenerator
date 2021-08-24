import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { NPMIgnoreFileMappingTests } from "./NPMIgnoreFileMapping.test";
import { NPMPackagingTests } from "./NPMPackaging";
import { TypeScriptTests } from "./TypeScript";

/**
 * Registers tests for file-mappings for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            NPMIgnoreFileMappingTests(context);
            NPMPackagingTests(context);
            TypeScriptTests();
        });
}
