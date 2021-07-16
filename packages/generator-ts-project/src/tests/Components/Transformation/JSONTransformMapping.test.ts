import { deepStrictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, JSONFileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { assign } from "comment-json";
import { writeFile } from "fs-extra";
import { JSONCTransformMapping } from "../../../Components/Transformation/JSONCTransformMapping";
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
        nameof(JSONCTransformMapping),
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TestJSONTransformMapping;
            let tester: JSONFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestJSONTransformMapping>;
            let sourceData: any;
            let addition: Record<string, any>;

            /**
             * Provides an implementation of the {@link JSONTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class.
             */
            class TestJSONTransformMapping extends JSONCTransformMapping<ITestGeneratorSettings, GeneratorOptions, any>
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
                 * @param data
                 * The data to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(data: any): Promise<any>
                {
                    return assign(data, addition);
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
                    tester = new JSONFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    sourceData = context.RandomObject;
                    addition = { [context.RandomString]: context.RandomObject };
                    await writeFile(sourceFile.FullName, JSON.stringify(sourceData));
                    await tester.Run();
                });

            suite(
                nameof<TestJSONTransformMapping>((mapping) => mapping.Transform),
                () =>
                {
                    test(
                        "Checking whether the data can be transformed",
                        async () =>
                        {
                            for (let key in addition)
                            {
                                deepStrictEqual((await tester.Metadata)[key], addition[key]);
                            }
                        });
                });
        });
}
