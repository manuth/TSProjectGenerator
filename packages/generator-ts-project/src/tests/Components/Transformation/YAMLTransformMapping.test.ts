import { deepStrictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorSettings, TestGenerator } from "@manuth/extended-yo-generator-test";
import { YAMLFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { writeFile } from "fs-extra";
import { Document, stringify } from "yaml";
import { YAMLTransformMapping } from "../../../Components/Transformation/YAMLTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class.
 */
export function YAMLTransformMappingTests(): void
{
    suite(
        nameof(YAMLTransformMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let outputFile: TempFile;
            let fileMappingOptions: TestYAMLTransformMapping;
            let tester: YAMLFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestYAMLTransformMapping>;
            let sourceData: any;
            let randomData: any;

            /**
             * Provides an implementation of the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class for testing.
             */
            class TestYAMLTransformMapping extends YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>
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
                    return outputFile.FullName;
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
                public override async Transform(data: Document.Parsed[]): Promise<Document.Parsed[]>
                {
                    data.map(
                        (document) =>
                        {
                            document.contents = randomData;
                        });

                    return data;
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    outputFile = new TempFile();
                    fileMappingOptions = new TestYAMLTransformMapping();
                    tester = new YAMLFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    sourceData = context.RandomObject;
                    randomData = context.RandomObject;
                    await writeFile(sourceFile.FullName, stringify(sourceData));
                });

            suite(
                nameof<TestYAMLTransformMapping>((mapping) => mapping.Transform),
                () =>
                {
                    test(
                        "Checking whether the content can be transformed correctly…",
                        async () =>
                        {
                            await tester.Run();

                            for (let document of await tester.ParseOutput())
                            {
                                deepStrictEqual(document.toJSON(), randomData);
                            }
                        });
                });
        });
}
