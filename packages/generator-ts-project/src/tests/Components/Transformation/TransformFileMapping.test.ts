import { deepStrictEqual, notDeepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, JSONFileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { TransformFileMapping } from "../../../Components/Transformation/TransformFileMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TransformFileMapping `TransformFileMapping<TSettings, TOptions, TData>`} class.
 *
 * @param context
 * The test-context.
 */
export function TransformFileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(TransformFileMapping),
        () =>
        {
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: TransformFileMapping<ITestGeneratorSettings, GeneratorOptions, any>;
            let tester: JSONFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TransformFileMapping<ITestGeneratorSettings, GeneratorOptions, any>>;
            let randomSource: any;
            let modifiedSource: any;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    tempFile = new TempFile();

                    fileMappingOptions = new class extends TransformFileMapping<ITestGeneratorSettings, GeneratorOptions, any>
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
                            return tempFile.FullName;
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): string
                        {
                            return tempFile.FullName;
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
                        protected override async Transform(data: any): Promise<any>
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
                    deepStrictEqual(await fileMappingOptions.Metadata, randomSource);
                });

            test(
                "Checking whether the data is dumped as expected…",
                async function()
                {
                    await tester.Run();
                    strictEqual(await tester.Content, JSON.stringify(modifiedSource));
                });

            test(
                "Checking whether the data is transformed correctly…",
                async function()
                {
                    await tester.Run();
                    notDeepStrictEqual(await tester.Metadata, randomSource);
                    deepStrictEqual(await tester.Metadata, modifiedSource);
                });
        });
}
