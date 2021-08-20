import { ok, strictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { SourceFile } from "ts-morph";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";

/**
 * Registers tests for the {@link LicenseTypeFileMapping `LicenseTypeFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function LicenseTypeFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(LicenseTypeFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link LicenseTypeFileMapping `LicenseTypeFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestLicenseTypeFileMapping extends LicenseTypeFileMapping<IGeneratorSettings, GeneratorOptions>
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
            let fileMapping: TestLicenseTypeFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestLicenseTypeFileMapping>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestLicenseTypeFileMapping(generator, namingContext);
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                });

            suite(
                nameof<TestLicenseTypeFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestLicenseTypeFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.LicenseTypeFileName);
                        });
                });

            suite(
                nameof<TestLicenseTypeFileMapping>((fileMapping) => fileMapping.Transform),
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
                            ok((await tester.Require())[namingContext.LicenseTypeEnumName]);
                        });

                    test(
                        "Checking whether all expected license-types are present in the enumeration…",
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            let licenseTypes = (await tester.Require())[namingContext.LicenseTypeEnumName];
                            ok(namingContext.ApacheMember in licenseTypes);
                            ok(namingContext.GPLMember in licenseTypes);
                        });
                });
        });
}
