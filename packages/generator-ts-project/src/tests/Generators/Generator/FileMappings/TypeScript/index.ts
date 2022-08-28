import { basename } from "path";
import mock from "mock-require";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../../TestContext.js";
import { GeneratorClassFileMappingTests } from "./GeneratorClassFileMapping.test.js";
import { GeneratorIndexFileMappingTests } from "./GeneratorIndexFileMapping.test.js";
import { GeneratorMainSuiteFileMappingTests } from "./GeneratorMainSuiteFileMapping.test.js";
import { GeneratorSuiteFileMappingTests } from "./GeneratorSuiteFileMapping.test.js";
import { GeneratorTestFileMappingTests } from "./GeneratorTestFileMapping.test.js";
import { LicenseTypeFileMappingTests } from "./LicenseTypeFileMapping.test.js";
import { NamingContextTests } from "./NamingContext.test.js";
import { SettingKeyFileMappingTests } from "./SettingKeyFileMapping.test.js";
import { SettingsInterfaceFileMappingTests } from "./SettingsInterfaceFileMapping.test.js";

/**
 * Registers tests for the typescript file-mappings.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            let mockedModules = [
                "chalk",
                "dedent",
                "path",
                "yosay",
                "@manuth/extended-yo-generator"
            ];

            suiteSetup(
                () =>
                {
                    for (let moduleName of mockedModules)
                    {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        mock(moduleName, require(moduleName));
                    }
                });

            suiteTeardown(
                () =>
                {
                    for (let moduleName of mockedModules)
                    {
                        mock.stop(moduleName);
                    }
                });

            NamingContextTests(context);
            LicenseTypeFileMappingTests(context);
            SettingKeyFileMappingTests(context);
            SettingsInterfaceFileMappingTests(context);
            GeneratorClassFileMappingTests(context);
            GeneratorIndexFileMappingTests(context);
            GeneratorMainSuiteFileMappingTests(context);
            GeneratorSuiteFileMappingTests(context);
            GeneratorTestFileMappingTests(context);
        });
}
