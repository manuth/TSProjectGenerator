import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../../TestContext";
import { TSModulePackageFileMappingTests } from "./TSModulePackageFileMapping.test";

/**
 * Registers tests for npm-packaging file-mappings for the `TSModule` generator.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "NPMPackaging",
        () =>
        {
            TSModulePackageFileMappingTests(context);
        });
}
