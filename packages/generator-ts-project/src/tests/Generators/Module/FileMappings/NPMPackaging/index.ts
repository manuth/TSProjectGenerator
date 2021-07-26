import { basename } from "path";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../../TestContext";
import { TSModulePackageFileMappingTests } from "./TSModulePackageFileMapping.test";

/**
 * Registers tests for npm-packaging file-mappings for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            TSModulePackageFileMappingTests(context);
        });
}
