import { ok, strictEqual } from "node:assert";
import { Generator, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { SourceFile } from "ts-morph";
import { GeneratorClassFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorClassFileMapping.js";
import { GeneratorIndexFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/GeneratorIndexFileMapping.js";
import { LicenseTypeFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/LicenseTypeFileMapping.js";
import { NamingContext } from "../../../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { SettingKeyFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingKeyFileMapping.js";
import { SettingsInterfaceFileMapping } from "../../../../../generators/generator/FileMappings/TypeScript/SettingsInterfaceFileMapping.js";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../../TestContext.js";

/**
 * Registers tests for the {@link GeneratorIndexFileMapping `GeneratorIndexFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function GeneratorIndexFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(GeneratorIndexFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link GeneratorIndexFileMapping `GeneratorIndexFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestGeneratorIndexFileMapping extends GeneratorIndexFileMapping<IGeneratorSettings, GeneratorOptions>
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

            let generator: TSGeneratorGenerator;
            let namingContext: NamingContext;
            let fileMapping: TestGeneratorIndexFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestGeneratorIndexFileMapping>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    generator = await context.Generator;
                    namingContext = new NamingContext("test", "Test", generator.SourceRoot);
                    fileMapping = new TestGeneratorIndexFileMapping(generator, namingContext);
                    await new FileMappingTester(generator, new GeneratorClassFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingKeyFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new SettingsInterfaceFileMapping(generator, namingContext)).Run();
                    await new FileMappingTester(generator, new LicenseTypeFileMapping(generator, namingContext)).Run();
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                });

            suite(
                nameof<TestGeneratorIndexFileMapping>((fileMapping) => fileMapping.Destination),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof<TestGeneratorIndexFileMapping>((fm) => fm.Destination)}\` points to the proper location…`,
                        () =>
                        {
                            strictEqual(fileMapping.Destination, namingContext.GeneratorIndexFileName);
                        });
                });

            suite(
                nameof<TestGeneratorIndexFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    suiteSetup(
                        async function()
                        {
                            this.timeout(20 * 1000);
                            let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                            await tester.DumpOutput(sourceFile);
                            sourceFile.forget();
                        });

                    test(
                        `Checking whether \`${nameof(module)}.${nameof(module.exports)}\` is a yeoman-generator…`,
                        async function()
                        {
                            this.timeout(1.5 * 60 * 1000);
                            this.slow(45 * 1000);
                            ok(context.CreateGenerator(await tester.Require()) instanceof Generator);
                        });
                });
        });
}
