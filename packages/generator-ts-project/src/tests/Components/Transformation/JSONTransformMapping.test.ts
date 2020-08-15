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
    suite(
        "JSONTransformMapping",
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: JSONTransformMapping<ITestGeneratorSettings, any>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, JSONTransformMapping<ITestGeneratorSettings, any>>;
            let sourceData: any;
            let randomData: any;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    fileMappingOptions = new class extends JSONTransformMapping<ITestGeneratorSettings, any>
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
                        public async Transform(data: any): Promise<any>
                        {
                            return randomData;
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
                    sourceData = context.RandomObject;
                    randomData = context.RandomObject;
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
                    Assert.deepStrictEqual(JSON.parse(await tester.Content), randomData);
                });
        });
}
