import { basename } from "path";
import { TSModuleGenerator } from "../../../../../generators/module/TSModuleGenerator.js";
import { TestContext } from "../../../../TestContext.js";
import { TSModulePackageFileMappingTests } from "./TSModulePackageFileMapping.test.js";

/**
 * Registers tests for npm-packaging file-mappings for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSModulePackageFileMappingTests(context);
        });
}
