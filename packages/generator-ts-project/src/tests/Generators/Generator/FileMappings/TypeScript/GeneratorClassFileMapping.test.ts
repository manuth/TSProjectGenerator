import { doesNotReject, ok, strictEqual } from "assert";
import { normalize } from "path";
import { Component, Generator, GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempDirectory, TempFileSystem } from "@manuth/temp-files";
import { DistinctQuestion } from "inquirer";
import { SourceFile } from "ts-morph";
import { TSGeneratorCategory } from "../../../../../generators/generator/Components/TSGeneratorCategory.js";
import { GeneratorClassFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorClassFileMapping.js";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping.js";
import { SettingsInterfaceFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingsInterfaceFileMapping.js";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { PackageFileMapping } from "../../../../../NPMPackaging/FileMappings/PackageFileMapping.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link GeneratorClassFileMapping `GeneratorClassFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorClassFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorClassFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link TSGeneratorCategory `TSGeneratorCategory<TSettings, TOptions>`} class for testing.
             */
            class TestTSGeneratorCategory extends TSGeneratorCategory<ITSGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param id
                 * The id of the generator.
                 *
                 * @param displayName
                 * The human readable name of the generator.
                 *
                 * @returns
                 * File-mappings for a generator.
                 */
                public override GetGeneratorFileMappings(id: string, displayName: string): Array<IFileMapping<ITSGeneratorSettings, GeneratorOptions>>
                {
                    return super.GetGeneratorFileMappings(id, displayName);
                }
            }

            /**
             * Provides an implementation of the {@link GeneratorClassFileMapping `GeneratorClassFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestGeneratorClassFileMapping extends GeneratorClassFileMapping<IGeneratorSettings, GeneratorOptions>
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
                    return super.Transform(sourceFile);
                }
            }

            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestGeneratorClassFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<ITSGeneratorSettings, GeneratorOptions>, ITSGeneratorSettings, GeneratorOptions, TestGeneratorClassFileMapping>;
            let settingKeyTester: TypeScriptFileMappingTester<IGenerator<ITSGeneratorSettings, GeneratorOptions>, ITSGeneratorSettings, GeneratorOptions, SettingKeyFileMapping<ITSGeneratorSettings, GeneratorOptions>>;
            let settingsInterfaceTester: TypeScriptFileMappingTester<IGenerator<ITSGeneratorSettings, GeneratorOptions>, ITSGeneratorSettings, GeneratorOptions, SettingsInterfaceFileMapping<ITSGeneratorSettings, GeneratorOptions>>;
            let licenseTypeTester: TypeScriptFileMappingTester<IGenerator<ITSGeneratorSettings, GeneratorOptions>, ITSGeneratorSettings, GeneratorOptions, LicenseTypeFileMapping<ITSGeneratorSettings, GeneratorOptions>>;
            let settingKeyEnum: Record<string, string>;
            let licenseTypeEnum: Record<string, string>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    new FileMappingTester(generator, new PackageFileMapping(generator)).Run();
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestGeneratorClassFileMapping(generator, namingContext);
                    settingKeyTester = new TypeScriptFileMappingTester(generator, new SettingKeyFileMapping(generator, namingContext));
                    settingsInterfaceTester = new TypeScriptFileMappingTester(generator, new SettingsInterfaceFileMapping(generator, namingContext));
                    licenseTypeTester = new TypeScriptFileMappingTester(generator, new LicenseTypeFileMapping(generator, namingContext));
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                    await settingKeyTester.Run();
                    await settingsInterfaceTester.Run();
                    await licenseTypeTester.Run();

                    for (let fileMapping of new TestTSGeneratorCategory(generator).GetGeneratorFileMappings(namingContext.GeneratorID, namingContext.GeneratorDisplayName))
                    {
                        await new FileMappingTester(generator, fileMapping as IFileMapping<IGeneratorSettings, GeneratorOptions>).Run();
                    }

                    settingKeyEnum = (await settingKeyTester.Require())[namingContext.SettingKeyEnumName];
                    licenseTypeEnum = (await licenseTypeTester.Require())[namingContext.LicenseTypeEnumName];
                });

            suite(
                nameof<TestGeneratorClassFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorClassFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorClassFileName);
                        });
                });

            suite(
                nameof<TestGeneratorClassFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    let testGenerator: Generator;
                    let tempDir: TempDirectory;
                    context.RegisterWorkingDirRestorer();

                    /**
                     * Gets the question with the specified {@link name `name`}.
                     *
                     * @param name
                     * The name of the question to get.
                     *
                     * @returns
                     * The question with the specified {@link name `name`}.
                     */
                    function GetQuestion(name: string): DistinctQuestion
                    {
                        return testGenerator.Questions.find(
                            (question) =>
                            {
                                return question.name === name;
                            }) as DistinctQuestion;
                    }

                    suiteSetup(
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                            await tester.DumpOutput(sourceFile);
                            sourceFile.forget();

                            testGenerator = context.CreateGenerator(
                                (await tester.Require())[namingContext.GeneratorClassName],
                                [],
                                {
                                    resolved: generator.destinationPath(namingContext.GeneratorClassFileName)
                                });
                        });

                    setup(
                        () =>
                        {
                            tempDir = new TempDirectory();
                        });

                    teardown(
                        () =>
                        {
                            tempDir.Dispose();
                        });

                    suite(
                        "General",
                        () =>
                        {
                            test(
                                "Checking whether the resulting typescript-code is valid…",
                                async function()
                                {
                                    this.timeout(1.5 * 60 * 1000);
                                    this.slow(45 * 1000);

                                    await doesNotReject(
                                        async () =>
                                        {
                                            await tester.Require();
                                        });
                                });

                            test(
                                `Checking whether the exported component inherits the \`${nameof(Generator)}\` class…`,
                                async () =>
                                {
                                    ok(testGenerator instanceof Generator);
                                });
                        });

                    suite(
                        nameof<Generator>((generator) => generator.TemplateRoot),
                        () =>
                        {
                            test(
                                `Checking whether the generator's \`${nameof<Generator>((g) => g.TemplateRoot)}\` is set correctly…`,
                                () =>
                                {
                                    strictEqual(testGenerator.TemplateRoot, namingContext.GeneratorID);
                                });
                        });

                    suite(
                        nameof<Generator>((generator) => generator.Questions),
                        () =>
                        {
                            test(
                                "Checking whether questions for all generator-settings are present…",
                                () =>
                                {
                                    ok(GetQuestion(settingKeyEnum[namingContext.DestinationMember]));
                                    ok(GetQuestion(settingKeyEnum[namingContext.NameMember]));
                                    ok(GetQuestion(settingKeyEnum[namingContext.DescriptionMember]));
                                });

                            test(
                                `Checking whether the destination is resolved to the \`${nameof(process)}.${nameof(process.cwd)}\` if the path isn't absolute…`,
                                async () =>
                                {
                                    let destinationQuestion = GetQuestion(settingKeyEnum[namingContext.DestinationMember]);
                                    let testDir = TempFileSystem.TempBaseName();

                                    strictEqual(
                                        normalize(await destinationQuestion.filter(tempDir.FullName, {})),
                                        normalize(tempDir.FullName));

                                    process.chdir(tempDir.FullName);

                                    strictEqual(
                                        normalize(await destinationQuestion.filter(testDir, {})),
                                        normalize(tempDir.MakePath(testDir)));
                                });

                            test(
                                `Checking whether the generator's \`${nameof<Generator>((g) => g.destinationRoot)}\` is changed after answering the destination-question…`,
                                async () =>
                                {
                                    let destinationQuestion = GetQuestion(settingKeyEnum[namingContext.DestinationMember]);
                                    destinationQuestion.filter(tempDir.FullName, {});
                                    strictEqual(normalize(testGenerator.destinationRoot()), normalize(tempDir.FullName));
                                });

                            test(
                                "Checking whether the name of the default project-name is chosen according to the destination-path…",
                                async () =>
                                {
                                    let nameQuestion = GetQuestion(settingKeyEnum[namingContext.NameMember]);
                                    let name = TempFileSystem.TempBaseName();

                                    strictEqual(
                                        await nameQuestion.default(
                                            {
                                                [settingKeyEnum[namingContext.DestinationMember]]: tempDir.MakePath(name)
                                            }),
                                        name);
                                });
                        });

                    suite(
                        nameof<Generator>((generator) => generator.Components),
                        () =>
                        {
                            test(
                                "Checking whether all file-mappings can be executed…",
                                async () =>
                                {
                                    let testDir = TempFileSystem.TempBaseName();
                                    let destinationRoot = tempDir.MakePath(testDir);

                                    Object.assign(
                                        testGenerator.Settings,
                                        {
                                            [settingKeyEnum[namingContext.DestinationMember]]: destinationRoot,
                                            [settingKeyEnum[namingContext.NameMember]]: testDir,
                                            [settingKeyEnum[namingContext.DescriptionMember]]: "description",
                                            [settingKeyEnum[namingContext.LicenseTypeMember]]: licenseTypeEnum[namingContext.ApacheMember]
                                        });

                                    testGenerator.destinationRoot(destinationRoot);

                                    for (let category of testGenerator.Components.Categories)
                                    {
                                        for (let component of category.Components)
                                        {
                                            for (let fileMapping of new Component(testGenerator, component).FileMappings.Items)
                                            {
                                                await doesNotReject(
                                                    async () =>
                                                    {
                                                        await fileMapping.Processor();
                                                    });
                                            }
                                        }
                                    }
                                });
                        });
                });
        });
}
