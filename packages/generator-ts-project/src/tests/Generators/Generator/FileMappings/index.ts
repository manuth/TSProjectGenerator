import { basename } from "path";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { NPMPackagingFileMappingTests } from "./NPMPackaging";
import { TypeScriptTests } from "./TypeScript";

/**
 * Registers tests for the file-mappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            NPMPackagingFileMappingTests(context);
            TypeScriptTests(context);
        });
}
