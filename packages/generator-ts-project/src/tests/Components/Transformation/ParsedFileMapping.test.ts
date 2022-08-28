import { deepStrictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { JSONCConverter } from "../../../Components/Transformation/Conversion/JSONCConverter.js";
import { TextConverter } from "../../../Components/Transformation/Conversion/TextConverter.js";
import { ParsedFileMapping } from "../../../Components/Transformation/ParsedFileMapping.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link ParsedFileMapping `ParsedFileMapping<TSettings, TOptions, TData>`} class.
 */
export function ParsedFileMappingTests(): void
{
    suite(
        nameof(ParsedFileMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let testObject: any;
            let fileMapping: TestParsedFileMapping;
            let tester: FileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestParsedFileMapping>;

            /**
             * Provides an implementation of the {@link ParsedFileMapping `ParsedFileMapping<TSettings, TOptions, TData>`} class for testing.
             */
            class TestParsedFileMapping extends ParsedFileMapping<IGeneratorSettings, GeneratorOptions, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Source(): string
                {
                    return sourceFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return null;
                }

                /**
                 * @inheritdoc
                 */
                public get Converter(): TextConverter<any>
                {
                    return new JSONCConverter();
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                });

            suiteTeardown(
                () =>
                {
                    sourceFile.Dispose();
                });

            setup(
                async () =>
                {
                    testObject = context.RandomObject;
                    fileMapping = new TestParsedFileMapping(generator);
                    tester = new FileMappingTester(generator, fileMapping);
                    await tester.WriteSource(new JSONCConverter().Dump(testObject));
                });

            suite(
                nameof<ParsedFileMapping<any, any, any>>((fileMapping) => fileMapping.GetSourceObject),
                () =>
                {
                    test(
                        "Checking whether the source-object is loaded from the source-file…",
                        async () =>
                        {
                            deepStrictEqual(await fileMapping.GetSourceObject(), testObject);
                        });
                });
        });
}
