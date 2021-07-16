import { deepStrictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, JSONFileMappingTester, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { JSONCCreatorMapping } from "../../Components/JSONCCreatorMapping";

/**
 * Registers tests for the {@link JSONCreatorMapping `JSONCreatorMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function JSONCreatorMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(JSONCCreatorMapping),
        () =>
        {
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: JSONCCreatorMapping<ITestGeneratorSettings, GeneratorOptions, any>;
            let tester: JSONFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, JSONCCreatorMapping<ITestGeneratorSettings, GeneratorOptions, any>>;
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
                    randomObject = context.RandomObject;
                    fileMappingOptions = new JSONCCreatorMapping(generator, tempFile.FullName, randomObject);
                    tester = new JSONFileMappingTester(generator, fileMappingOptions);
                });

            suite(
                nameof<JSONCCreatorMapping<any, any, any>>((mapping) => mapping.Processor),
                () =>
                {
                    test(
                        "Checking whether the json-data is written correctly…",
                        async () =>
                        {
                            await tester.Run();
                            deepStrictEqual(await tester.Metadata, randomObject);
                        });
                });
        });
}
