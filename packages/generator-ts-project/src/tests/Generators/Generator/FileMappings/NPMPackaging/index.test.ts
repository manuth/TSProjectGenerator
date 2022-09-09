import { basename } from "node:path";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../../TestContext.js";
import { TSGeneratorPackageFileMappingTests } from "./TSGeneratorPackageFileMapping.test.js";

/**
 * Registers tests for npm file-mappings for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSGeneratorPackageFileMappingTests(context);
        });
}
