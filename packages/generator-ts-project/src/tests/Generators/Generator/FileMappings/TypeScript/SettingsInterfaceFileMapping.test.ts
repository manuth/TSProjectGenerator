import { doesNotThrow, ok, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { ESLint } from "eslint";
import npmWhich from "npm-which";
import { SourceFile, SyntaxKind } from "ts-morph";
import { GeneratorClassFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorClassFileMapping.js";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping.js";
import { SettingsInterfaceFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingsInterfaceFileMapping.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { ESLintRCFileMapping } from "../../../../../Linting/FileMappings/ESLintRCFileMapping.js";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link SettingsInterfaceFileMapping `SettingsInterfaceFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function SettingsInterfaceFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(SettingsInterfaceFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link SettingsInterfaceFileMapping `SettingsInterfaceFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestSettingsInterfaceFileMapping extends SettingsInterfaceFileMapping<ITSProjectSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    this.Dispose();
                    return super.Transform(sourceFile);
                }
            }

            let npmPath: string;
            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestSettingsInterfaceFileMapping;
            let tester: TypeScriptFileMappingTester<TSGeneratorGenerator, ITSProjectSettings, GeneratorOptions, TestSettingsInterfaceFileMapping>;
            let eslintConfigFileName: string;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");
                    generator = await context.Generator;
                    let eslintConfigTester = new FileMappingTester(generator, new ESLintRCFileMapping(generator));
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot, true);
                    await eslintConfigTester.Run();
                    await new FileMappingTester(generator, new GeneratorClassFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingKeyFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingsInterfaceFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new LicenseTypeFileMapping(generator, namingContext)).Run();
                    fileMapping = new TestSettingsInterfaceFileMapping(generator, namingContext);
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                    eslintConfigFileName = eslintConfigTester.FileMapping.Destination;

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });
                });

            suite(
                nameof<TestSettingsInterfaceFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestSettingsInterfaceFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.SettingsInterfaceFileName);
                        });
                });

            suite(
                nameof<TestSettingsInterfaceFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    let sourceFile: SourceFile;

                    suiteSetup(
                        async function()
                        {
                            this.timeout(20 * 1000);
                            sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                        });

                    suiteTeardown(
                        () =>
                        {
                            sourceFile.forget();
                        });

                    test(
                        "Checking whether an interface with the expected name is present…",
                        function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            doesNotThrow(() => sourceFile.getExportedDeclarations().get(namingContext.SettingsInterfaceName)[0].asKindOrThrow(SyntaxKind.InterfaceDeclaration));
                        });

                    test(
                        "Checking whether all expected members are present in the interface…",
                        () =>
                        {
                            let interfaceDeclaration = sourceFile.getInterface(namingContext.SettingsInterfaceName);
                            let properties = interfaceDeclaration.getProperties();

                            for (
                                let member of [
                                    namingContext.DestinationMember,
                                    namingContext.NameMember,
                                    namingContext.DescriptionMember,
                                    namingContext.LicenseTypeMember
                                ])
                            {
                                ok(properties.some(
                                    (property) =>
                                    {
                                        let propertyName = property.getNodeProperty("name").asKind(
                                            SyntaxKind.ComputedPropertyName)?.getExpression().asKind(
                                                SyntaxKind.PropertyAccessExpression);

                                        return propertyName?.getExpression().getText() === namingContext.SettingKeyEnumName &&
                                            propertyName.getName() === member;
                                    }));
                            }
                        });

                    test(
                        "Checking whether the resulting code does not contain any linting issues…",
                        async () =>
                        {
                            let linter = new ESLint(
                                {
                                    useEslintrc: false,
                                    overrideConfigFile: eslintConfigFileName
                                });

                            await tester.DumpOutput(sourceFile);
                            let result = await linter.lintFiles(tester.FileMapping.Destination);

                            strictEqual(
                                result.flatMap(
                                    (eslintResult) => eslintResult.messages).length,
                                0);
                        });
                });
        });
}
