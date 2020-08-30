import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../../TestContext";
import { TSGeneratorPackageFileMappingTests } from "./TSGeneratorPackageFileMapping.test";

/**
 * Registers tests for npm file-mappings for `TSGenerator`s.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "NPMPackaging",
        () =>
        {
            TSGeneratorPackageFileMappingTests(context);
        });
}
