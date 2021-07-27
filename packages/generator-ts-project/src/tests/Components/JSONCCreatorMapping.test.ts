import { deepStrictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorSettings, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { JSONCCreatorMapping } from "../../Components/JSONCCreatorMapping";

/**
 * Registers tests for the {@link JSONCreatorMapping `JSONCreatorMapping<TSettings, TOptions>`} class.
 */
export function JSONCreatorMappingTests(): void
{
    suite(
        nameof(JSONCCreatorMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMappingOptions: JSONCCreatorMapping<ITestGeneratorSettings, GeneratorOptions, any>;
            let tester: JSONCFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, JSONCCreatorMapping<ITestGeneratorSettings, GeneratorOptions, any>>;
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
                    tester = new JSONCFileMappingTester(generator, fileMappingOptions);
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
                            deepStrictEqual(await tester.ParseOutput(), randomObject);
                        });
                });
        });
}
