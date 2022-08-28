import { deepStrictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { assign } from "comment-json";
import fs from "fs-extra";
import { JSONCTransformMapping } from "../../../Components/Transformation/JSONCTransformMapping.js";
import { TestContext } from "../../TestContext.js";

const { writeFile } = fs;

/**
 * Registers tests for the {@link JSONCTransformMapping `JSONCTransformMapping<TSettings, TOptions, TData>`} class.
 */
export function JSONCTransformMappingTests(): void
{
    suite(
        nameof(JSONCTransformMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TestJSONTransformMapping;
            let tester: JSONCFileMappingTester<TestGenerator, IGeneratorSettings, GeneratorOptions, TestJSONTransformMapping>;
            let sourceData: any;
            let addition: Record<string, any>;

            /**
             * Provides an implementation of the {@link JSONTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class for testing.
             */
            class TestJSONTransformMapping extends JSONCTransformMapping<IGeneratorSettings, GeneratorOptions, any>
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
                    tester = new JSONCFileMappingTester(generator, fileMappingOptions);
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
                        "Checking whether the data can be transformed…",
                        async () =>
                        {
                            for (let key in addition)
                            {
                                deepStrictEqual((await tester.ParseOutput())[key], addition[key]);
                            }
                        });
                });
        });
}
