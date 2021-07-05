import { deepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { Document } from "yaml";
import { YAMLTransformMapping } from "../../Components/Transformation/YAMLTransformMapping";
import { YAMLCreatorMapping } from "../../Components/YAMLCreatorMapping";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link YAMLCreatorMapping `YAMLCreatorMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function YAMLCreatorMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "YAMLCreatorMapping",
        () =>
        {
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: YAMLCreatorMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, YAMLCreatorMapping<ITestGeneratorSettings, GeneratorOptions>>;
            let checker: YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>;
            let randomObject: any;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    tempFile = new TempFile();
                });

            setup(
                () =>
                {
                    let document = new Document();
                    randomObject = context.RandomObject;
                    document.contents = randomObject;

                    fileMappingOptions = new YAMLCreatorMapping(
                        generator,
                        tempFile.FullName,
                        [
                            document
                        ]);

                    tester = new FileMappingTester(generator, fileMappingOptions);

                    checker = new class extends YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>
                    {
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
                            return null;
                        }
                    }(generator);
                });

            test(
                "Checking whether the yaml-data is written correctly…",
                async function()
                {
                    this.timeout(1 * 1000);
                    this.slow(1 * 1000);
                    await tester.Run();
                    let documents = await checker.Metadata;
                    strictEqual(documents.length, 1);
                    let document = documents[0];
                    deepStrictEqual(document.toJSON(), randomObject);
                });
        });
}
