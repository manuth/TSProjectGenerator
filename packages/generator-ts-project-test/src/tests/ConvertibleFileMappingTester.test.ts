import { strictEqual } from "assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCConverter, TextConverter } from "@manuth/generator-ts-project";
import { TempFile } from "@manuth/temp-files";
import fs from "fs-extra";
import { ConvertibleFileMappingTester } from "../ConvertibleFileMappingTester.js";

const { readFile } = fs;

/**
 * Registers tests for the {@link ConvertibleFileMappingTester `ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
 */
export function ConvertibleFileMappingTesterTests(): void
{
    suite(
        nameof(ConvertibleFileMappingTester),
        () =>
        {
            /**
             * Provides an implementation of the {@link ConvertibleFileMappingTester `ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
             */
            class TestConvertibleFileMappingTester extends ConvertibleFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Converter(): TextConverter<any>
                {
                    return new JSONCConverter();
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let outputFile: TempFile;
            let tester: TestConvertibleFileMappingTester;
            let fileMapping: IFileMapping<IGeneratorSettings, GeneratorOptions>;
            let testObject: any;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    sourceFile = new TempFile();
                    outputFile = new TempFile();

                    fileMapping = {
                        Source: sourceFile.FullName,
                        Destination: sourceFile.FullName
                    };

                    testObject = context.RandomObject;
                    tester = new TestConvertibleFileMappingTester(generator, fileMapping);
                });

            teardown(
                () =>
                {
                    sourceFile.Dispose();
                    outputFile.Dispose();
                });

            suite(
                nameof<TestConvertibleFileMappingTester>((tester) => tester.Dump),
                () =>
                {
                    test(
                        "Checking whether the data is dumped correctly…",
                        () =>
                        {
                            strictEqual(tester.Dump(testObject), new JSONCConverter().Dump(testObject));
                        });
                });

            suite(
                nameof<TestConvertibleFileMappingTester>((tester) => tester.DumpFile),
                async () =>
                {
                    test(
                        "Checking whether the data is dumped to the specified file…",
                        async () =>
                        {
                            await tester.DumpFile(outputFile.FullName, testObject);
                            strictEqual((await readFile(outputFile.FullName)).toString(), new JSONCConverter().Dump(testObject));
                        });
                });

            suite(
                nameof<TestConvertibleFileMappingTester>((tester) => tester.DumpSource),
                () =>
                {
                    test(
                        "Checking whether data can be dumped to the source…",
                        async () =>
                        {
                            await tester.DumpSource(testObject);
                            strictEqual(await tester.ReadSource(), new JSONCConverter().Dump(testObject));
                        });
                });

            suite(
                nameof<TestConvertibleFileMappingTester>((tester) => tester.DumpOutput),
                () =>
                {
                    test(
                        "Checking whether data can be dumped to the output…",
                        async () =>
                        {
                            await tester.DumpOutput(testObject);
                            strictEqual(await tester.ReadOutput(), new JSONCConverter().Dump(testObject));
                        });
                });
        });
}
