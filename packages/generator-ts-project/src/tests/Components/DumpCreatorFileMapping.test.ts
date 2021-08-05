import { deepStrictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { IDumper } from "../..";
import { DumpCreatorFileMapping } from "../../Components/DumpCreatorFileMapping";
import { JSONCConverter } from "../../Components/Transformation/Conversion/JSONCConverter";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link DumpCreatorFileMapping `DumpCreatorFileMapping<TSettings`}
 */
export function DumpCreatorFileMappingTests(): void
{
    suite(
        nameof(DumpCreatorFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link DumpCreatorFileMapping `DumpCreatorFileMapping<TSettings, TOptions, TData>`} class for testing.
             */
            class TestDumpCreatorFileMapping extends DumpCreatorFileMapping<IGeneratorSettings, GeneratorOptions, any>
            {
                /**
                 * @inheritdoc
                 */
                public get Dumper(): IDumper<any>
                {
                    return new JSONCConverter();
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            suite(
                nameof<TestDumpCreatorFileMapping>((fileMapping) => fileMapping.GetSourceObject),
                () =>
                {
                    test(
                        `Checking whether the source-object is loaded from the parameter passed to the \`${nameof(DumpCreatorFileMapping.constructor)}\`…`,
                        async () =>
                        {
                            let testObject = context.RandomObject;
                            deepStrictEqual(await new TestDumpCreatorFileMapping(generator, null, testObject).GetSourceObject(), testObject);
                        });
                });
        });
}
