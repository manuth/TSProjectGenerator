import { deepStrictEqual } from "assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { IParser, JSONCConverter } from "@manuth/generator-ts-project";
import { TempFile } from "@manuth/temp-files";
import { ParsableFileMappingTester } from "../ParsableFileMappingTester";

/**
 * Registers tests for the {@link ParsableFileMappingTester `ParsableFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
 */
export function ParsableFileMappingTesterTests(): void
{
    suite(
        nameof(ParsableFileMappingTester),
        () =>
        {
            /**
             * Provides an implementation of the {@link ParsableFileMappingTester `ParsableFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class for testing.
             */
            class TestParsableFileMappingTester extends ParsableFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Parser(): IParser<any>
                {
                    return new JSONCConverter();
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let outputFile: TempFile;
            let tester: TestParsableFileMappingTester;
            let testObject: any;
            let testObjectDump: string;

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

                    tester = new TestParsableFileMappingTester(
                        generator,
                        {
                            Source: sourceFile.FullName,
                            Destination: outputFile.FullName
                        });

                    testObject = context.RandomObject;
                    testObjectDump = new JSONCConverter().Dump(testObject);
                });

            teardown(
                () =>
                {
                    sourceFile.Dispose();
                    outputFile.Dispose();
                });

            suite(
                nameof<TestParsableFileMappingTester>((tester) => tester.Parse),
                () =>
                {
                    test(
                        "Checking whether data is parsed correctly…",
                        async () =>
                        {
                            deepStrictEqual(tester.Parse(testObjectDump), testObject);
                        });
                });

            suite(
                nameof<TestParsableFileMappingTester>((tester) => tester.ParseSource),
                () =>
                {
                    test(
                        "Checking whether the source-file is parsed correctly…",
                        async () =>
                        {
                            await tester.WriteSource(testObjectDump);
                            deepStrictEqual(await tester.ParseSource(), testObject);
                        });
                });

            suite(
                nameof<TestParsableFileMappingTester>((tester) => tester.ParseOutput),
                () =>
                {
                    test(
                        "Checking whether the output-file is parsed correctly…",
                        async () =>
                        {
                            await tester.WriteOutput(testObjectDump);
                            deepStrictEqual(await tester.ParseOutput(), testObject);
                        });
                });
        });
}
