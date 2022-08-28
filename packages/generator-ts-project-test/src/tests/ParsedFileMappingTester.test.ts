import { strictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONCTransformMapping, type ParsedFileMapping } from "@manuth/generator-ts-project";
import { ParsedFileMappingTester } from "../ParsedFileMappingTester.js";

/**
 * Registers tests for the {@link ParsedFileMapping `ParsedFileMapping<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
 */
export function ParsedFileMappingTesterTests(): void
{
    suite(
        nameof(ParsedFileMappingTester),
        () =>
        {
            /**
             * Provides an implementation of the {@link JSONCTransformMapping `JSONCTransformMapping<TSettings, TOptions, TData>`} class for testing.
             */
            class TestJSONCTransformMapping extends JSONCTransformMapping<IGeneratorSettings, GeneratorOptions, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Source(): string
                {
                    return null;
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
                public override get Converter(): any
                {
                    return testObject;
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let testObject: any;
            let fileMapping: TestJSONCTransformMapping;
            let tester: ParsedFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestJSONCTransformMapping, any>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    testObject = context.RandomObject;
                    fileMapping = new TestJSONCTransformMapping(generator);
                    tester = new ParsedFileMappingTester(generator, fileMapping);
                });

            suite(
                nameof<ParsedFileMappingTester<any, any, any, any, any>>((tester) => tester.Converter),
                () =>
                {
                    test(
                        `Checking whether the converter is loaded from the underlying \`${nameof<ParsedFileMappingTester<any, any, any, any, any>>((t) => t.FileMappingOptions)}\`…`,
                        () =>
                        {
                            strictEqual(tester.Converter, fileMapping.Converter);
                        });
                });
        });
}
