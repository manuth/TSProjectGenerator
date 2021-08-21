import { basename } from "path";
import mock = require("mock-require");
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../../TestContext";
import { GeneratorClassFileMappingTests } from "./GeneratorClassFileMapping.test";
import { GeneratorIndexFileMappingTests } from "./GeneratorIndexFileMapping.test";
import { GeneratorMainSuiteFileMappingTests } from "./GeneratorMainSuiteFileMapping.test";
import { GeneratorSuiteFileMappingTests } from "./GeneratorSuiteFileMapping.test";
import { GeneratorTestFileMappingTests } from "./GeneratorTestFileMapping.test";
import { LicenseTypeFileMappingTests } from "./LicenseTypeFileMapping.test";
import { NamingContextTests } from "./NamingContext.test";
import { SettingKeyFileMappingTests } from "./SettingKeyFileMapping.test";
import { SettingsInterfaceFileMappingTests } from "./SettingsInterfaceFileMapping.test";

/**
 * Registers tests for the typescript file-mappings.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(__dirname),
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
