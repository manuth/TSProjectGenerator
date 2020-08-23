import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestGenerator, ITestGeneratorOptions, ITestOptions, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { writeFile } from "fs-extra";
import { TempFile } from "temp-filesystem";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the `FileMappingBase` class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingBaseTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "FileMappingBase",
        () =>
        {
            let generator: TestGenerator;
            let tempSourceFile: TempFile;
            let tempDestinationFile: TempFile;
            let fileMappingOptions: FileMappingBase<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, FileMappingBase<ITestGeneratorSettings, GeneratorOptions>>;
            let randomValue: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    tempSourceFile = new TempFile();
                    tempDestinationFile = new TempFile();

                    fileMappingOptions = new class extends FileMappingBase<ITestGeneratorSettings, GeneratorOptions>
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
                            return context.CreatePromise(tempSourceFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): Promise<string>
                        {
                            return context.CreatePromise(tempDestinationFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         */
                        public async Processor(): Promise<void>
                        {
                            return this.WriteDestination(await this.Content);
                        }

                        /**
                         * @inheritdoc
                         *
                         * @param path
                         * The path to the file to read.
                         *
                         * @returns
                         * The contents of the file.
                         */
                        public async ReadFile(path: string): Promise<string>
                        {
                            return super.ReadFile(path);
                        }
                    }();

                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            setup(
                () =>
                {
                    randomValue = context.RandomString;
                });

            teardown(
                async () =>
                {
                    await tester.Commit();
                });

            suiteTeardown(
                () =>
                {
                    tempSourceFile.Dispose();
                    tempDestinationFile.Dispose();
                });

            test(
                "Checking whether the content is read from the source-file…",
                async () =>
                {
                    await writeFile(tempSourceFile.FullName, randomValue);
                    Assert.strictEqual(await fileMappingOptions.Content, randomValue);
                });

            test(
                "Checking whether the content is written to the `mem-fs` correctly…",
                async () =>
                {
                    await writeFile(tempSourceFile.FullName, randomValue);
                    await fileMappingOptions.Processor();
                    Assert.strictEqual(generator.fs.read(tempDestinationFile.FullName), randomValue);
                });
        });
}
