import Assert = require("assert");
import { TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { TempFile } from "temp-filesystem";
import { TransformFileMapping } from "../../../Components/Transformation/TransformFileMapping";
import { TestContext } from "../../TestContext";
import { JSONFileMappingTester } from "../JSONFileMappingTester";

/**
 * Registers tests for the `TransformFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TransformFileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "TransformFileMapping",
        () =>
        {
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: TransformFileMapping<ITestGeneratorSettings, any>;
            let tester: JSONFileMappingTester<TestGenerator, ITestGeneratorSettings, TransformFileMapping<ITestGeneratorSettings, any>>;
            let randomSource: any;
            let modifiedSource: any;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    tempFile = new TempFile();

                    fileMappingOptions = new class extends TransformFileMapping<ITestGeneratorSettings, any>
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
                            return context.CreatePromise(tempFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): Promise<string>
                        {
                            return context.CreatePromise(tempFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         *
                         * @returns
                         * A random value.
                         */
                        protected async Parse(): Promise<any>
                        {
                            return modifiedSource;
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
                        protected async Transform(data: any): Promise<any>
                        {
                            Object.assign(data, { transformed: true });
                            return data;
                        }

                        /**
                         * @inheritdoc
                         *
                         * @param data
                         * The data to dump.
                         *
                         * @returns
                         * A random value.
                         */
                        protected async Dump(data: any): Promise<string>
                        {
                            return JSON.stringify(data);
                        }
                    }();

                    tester = new JSONFileMappingTester(generator, fileMappingOptions);
                });

            setup(
                () =>
                {
                    randomSource = context.RandomObject;
                    modifiedSource = { ...randomSource };
                });

            test(
                "Checking whether the source is being parsed as expected…",
                async () =>
                {
                    Assert.deepStrictEqual(await fileMappingOptions.Metadata, randomSource);
                });

            test(
                "Checking whether the data is dumped as expected…",
                async function()
                {
                    await tester.Run();
                    Assert.strictEqual(await tester.Content, JSON.stringify(modifiedSource));
                });

            test(
                "Checking whether the data is transformed correctly…",
                async function()
                {
                    await tester.Run();
                    Assert.notDeepStrictEqual(await tester.Metadata, randomSource);
                    Assert.deepStrictEqual(await tester.Metadata, modifiedSource);
                });
        });
}
