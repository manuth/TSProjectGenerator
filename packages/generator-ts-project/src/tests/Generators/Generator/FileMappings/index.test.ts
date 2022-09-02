import { basename } from "path";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { NPMPackagingFileMappingTests } from "./NPMPackaging/index.test.js";
import { TypeScriptTests } from "./TypeScript/index.test.js";

/**
 * Registers tests for the file-mappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            NPMPackagingFileMappingTests(context);
            TypeScriptTests(context);
        });
}
