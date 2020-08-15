import Assert = require("assert");
import { TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { writeFile } from "fs-extra";
import { TempFile } from "temp-filesystem";
import { JSONTransformMapping } from "../../../Components/Transformation/JSONTransformMapping";
import { TestContext } from "../../TestContext";
import { FileMappingTester } from "../FileMappingTester";

/**
 * Registers tests for the `JSONTransformMapping` class.
 *
 * @param context
 * The test-context.
 */
export function JSONTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    /**
     * Provides test-data.
     */
    interface ITestData
    {
        /**
         * A random value.
         */
        randomValue: string;
    }

    suite(
        "JSONTransformMapping",
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: JSONTransformMapping<ITestGeneratorSettings, ITestData>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, JSONTransformMapping<ITestGeneratorSettings, ITestData>>;
            let sourceData: ITestData;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    fileMappingOptions = new class extends JSONTransformMapping<ITestGeneratorSettings, ITestData>
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
                        public get Source(): Promise<string>
                        {
                            return context.CreatePromise(sourceFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): Promise<string>
                        {
                            return context.CreatePromise(destinationFile.FullName);
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
                        public async Transform(data: ITestData): Promise<ITestData>
                        {
                            data.randomValue = randomValue;
                            return data;
                        }
                    }();

                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            suiteTeardown(
                () =>
                {
                    sourceFile.Dispose();
                    destinationFile.Dispose();
                });

            setup(
                async () =>
                {
                    sourceData = {
                        randomValue: context.RandomString
                    };

                    randomValue = context.RandomString;
                    await writeFile(sourceFile.FullName, JSON.stringify(sourceData));
                });

            test(
                "Checking whether the data is parsed correctly…",
                async () =>
                {
                    Assert.deepStrictEqual(await fileMappingOptions.Metadata, sourceData);
                });

            test(
                "Checking whether the data is transformed correctly…",
                async () =>
                {
                    await tester.Run();
                    let result: ITestData = JSON.parse(await tester.Content);
                    Assert.strictEqual(result.randomValue, randomValue);
                });
        });
}
