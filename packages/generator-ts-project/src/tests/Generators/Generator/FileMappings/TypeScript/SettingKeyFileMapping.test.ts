import { ok, strictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { SourceFile } from "ts-morph";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../../TestContext";

/**
 * Registers tests for the {@link SettingKeyFileMapping `SettingKeyFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function SettingKeyFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(SettingKeyFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link SettingKeyFileMapping `SettingKeyFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestSettingKeyFileMapping extends SettingKeyFileMapping<IGeneratorSettings, GeneratorOptions>
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
            let fileMapping: TestSettingKeyFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestSettingKeyFileMapping>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestSettingKeyFileMapping(generator, namingContext);
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                });

            suite(
                nameof<TestSettingKeyFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestSettingKeyFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.SettingKeyFileName);
                        });
                });

            suite(
                nameof<TestSettingKeyFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    suiteSetup(
                        async function()
                        {
                            this.timeout(5 * 1000);
                            await tester.DumpOutput(await fileMapping.Transform(await fileMapping.GetSourceObject()));
                        });

                    test(
                        "Checking whether the expected export-member is present…",
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            ok((await tester.Require())[namingContext.SettingKeyEnumName]);
                        });

                    test(
                        "Checking whether all expected enum-members are present…",
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            let settingKeys = (await tester.Require())[namingContext.SettingKeyEnumName];

                            for (
                                let member of [
                                    namingContext.DestinationMember,
                                    namingContext.NameMember,
                                    namingContext.DescriptionMember,
                                    namingContext.LicenseTypeMember
                                ])
                            {
                                ok(member in settingKeys);
                            }
                        });
                });
        });
}
