import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { writeFile } from "fs-extra";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link FileMappingBase `FileMappingBase<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function FileMappingBaseTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(FileMappingBase),
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
                    this.timeout(30 * 1000);
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
                        public override get Source(): string
                        {
                            return tempSourceFile.FullName;
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): string
                        {
                            return tempDestinationFile.FullName;
                        }

                        /**
                         * @inheritdoc
                         */
                        public override async Processor(): Promise<void>
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
                        public override async ReadFile(path: string): Promise<string>
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

            test(
                "Checking whether the content is read from the source-file…",
                async () =>
                {
                    await writeFile(tempSourceFile.FullName, randomValue);
                    strictEqual(await fileMappingOptions.Content, randomValue);
                });

            test(
                "Checking whether the content is written to the `mem-fs` correctly…",
                async () =>
                {
                    await writeFile(tempSourceFile.FullName, randomValue);
                    await fileMappingOptions.Processor();
                    strictEqual(generator.fs.read(tempDestinationFile.FullName), randomValue);
                });
        });
}
