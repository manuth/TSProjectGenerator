import { deepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorSettings, TestGenerator } from "@manuth/extended-yo-generator-test";
import { YAMLFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { Document } from "yaml";
import { YAMLCreatorMapping } from "../../Components/YAMLCreatorMapping";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link YAMLCreatorMapping `YAMLCreatorMapping<TSettings, TOptions>`} class.
 */
export function YAMLCreatorMappingTests(): void
{
    suite(
        nameof(YAMLCreatorMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: YAMLCreatorMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: YAMLFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, YAMLCreatorMapping<ITestGeneratorSettings, GeneratorOptions>>;
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

                    tester = new YAMLFileMappingTester(generator, fileMappingOptions);
                });

            suite(
                nameof<YAMLCreatorMapping<any, any>>((mapping) => mapping.Processor),
                () =>
                {
                    test(
                        "Checking whether the yaml-data is written correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(1 * 1000);
                            await tester.Run();
                            let documents = await tester.ParseOutput();
                            strictEqual(documents.length, 1);
                            let document = documents[0];
                            deepStrictEqual(document.toJSON(), randomObject);
                        });
                });
        });
}
