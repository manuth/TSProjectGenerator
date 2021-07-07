import { deepStrictEqual, ok } from "assert";
import { EOL } from "os";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { writeFile } from "fs-extra";
import { JSONTransformMapping } from "../../../Components/Transformation/JSONTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link JSONTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class.
 *
 * @param context
 * The test-context.
 */
export function JSONTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(JSONTransformMapping),
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TestJSONTransformMapping;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestJSONTransformMapping>;
            let sourceData: any;
            let randomData: any;

            /**
             * Provides an implementation of the {@link JSONTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class.
             */
            class TestJSONTransformMapping extends JSONTransformMapping<ITestGeneratorSettings, GeneratorOptions, any>
            {
                /**
                 * @inheritdoc
                 */
                public constructor()
                {
                    super(generator);
                }

                /**
                 * @inheritdoc
                 */
                public get Source(): string
                {
                    return sourceFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return destinationFile.FullName;
                }

                /**
                 * @inheritdoc
                 *
                 * @param text
                 * The text representing the meta-data.
                 *
                 * @returns
                 * An object loaded from the specified {@link text `text`}.
                 */
                public override async Parse(text: string): Promise<any>
                {
                    return super.Parse(text);
                }

                /**
                 * @inheritdoc
                 *
                 * @param data
                 * The data to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(data: any): Promise<any>
                {
                    return randomData;
                }

                /**
                 * @inheritdoc
                 *
                 * @param data
                 * The data to dump.
                 *
                 * @returns
                 * A text representing the specified {@link data `data`}.
                 */
                public override async Dump(data: any): Promise<string>
                {
                    return super.Dump(data);
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();
                    fileMappingOptions = new TestJSONTransformMapping();
                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    sourceData = context.RandomObject;
                    randomData = context.RandomObject;
                    await writeFile(sourceFile.FullName, JSON.stringify(sourceData));
                });

            suite(
                nameof<TestJSONTransformMapping>((mapping) => mapping.Parse),
                () =>
                {
                    test(
                        "Checking whether the data is parsed correctly…",
                        async () =>
                        {
                            deepStrictEqual(await fileMappingOptions.Metadata, sourceData);
                        });
                });

            suite(
                nameof<TestJSONTransformMapping>((mapping) => mapping.Dump),
                () =>
                {
                    test(
                        "Checking whether the data is dumped correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            deepStrictEqual(JSON.parse(await tester.Content), randomData);
                        });

                    test(
                        "Checking whether a trailing new-line is added…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            ok((await tester.Content).endsWith(EOL));
                        });
                });
        });
}
