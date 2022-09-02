import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { NPMIgnoreFileMappingTests } from "./NPMIgnoreFileMapping.test.js";
import { NPMPackagingTests } from "./NPMPackaging/index.test.js";
import { TypeScriptTests } from "./TypeScript/index.test.js";

/**
 * Registers tests for file-mappings for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            NPMIgnoreFileMappingTests(context);
            NPMPackagingTests(context);
            TypeScriptTests();
        });
}
