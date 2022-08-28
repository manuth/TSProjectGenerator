import { deepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { IDumper } from "../../../Components/Transformation/Conversion/IDumper.js";
import { JSONCConverter } from "../../../Components/Transformation/Conversion/JSONCConverter.js";
import { DumpFileMapping } from "../../../Components/Transformation/DumpFileMapping.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link DumpFileMapping `DumpFileMapping<TSettings, TOptions, TData>`} class.
 */
export function DumpFileMappingTests(): void
{
    suite(
        nameof(DumpFileMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let tester: JSONCFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestDumpFileMapping, string[]>;
            let fileMapping: TestDumpFileMapping;
            let tempFile: TempFile;
            let legacyTransform: boolean;
            let sourceValue: string;
            let dumpValue: string;
            let transformValue: string;

            /**
             * Provides an implementation of the {@link DumpFileMapping `DumpFileMapping<TSettings, TOptions, TData>`} class for testing.
             */
            class TestDumpFileMapping extends DumpFileMapping<IGeneratorSettings, GeneratorOptions, string[]>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return tempFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public get Dumper(): IDumper<string[]>
                {
                    return {
                        Dump(data: string[]): string
                        {
                            return new JSONCConverter<string[]>().Dump(
                                [
                                    ...data,
                                    dumpValue
                                ]);
                        }
                    };
                }

                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The object to dump.
                 */
                public async GetSourceObject(): Promise<string[]>
                {
                    return [
                        sourceValue
                    ];
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
                public override async Transform(data: string[]): Promise<string[]>
                {
                    return legacyTransform ?
                        super.Transform(data) :
                        [
                            ...data,
                            transformValue
                        ];
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    tempFile = new TempFile();
                    legacyTransform = false;
                    sourceValue = "source";
                    dumpValue = "dump";
                    transformValue = "transform";
                    fileMapping = new TestDumpFileMapping(generator);
                    tester = new JSONCFileMappingTester(generator, fileMapping);
                });

            teardown(
                () =>
                {
                    tempFile.Dispose();
                });

            suite(
                nameof<TestDumpFileMapping>((fileMapping) => fileMapping.Processor),
                () =>
                {
                    test(
                        "Checking whether loading, transforming and dumping the source is processed in the correct order…",
                        async () =>
                        {
                            await fileMapping.Processor();
                            await tester.Commit();

                            deepStrictEqual(
                                [
                                    ...await tester.ParseOutput()
                                ],
                                [
                                    sourceValue,
                                    transformValue,
                                    dumpValue
                                ]);
                        });
                });

            suite(
                nameof<TestDumpFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    test(
                        "Checking whether no transformation is applied…",
                        async () =>
                        {
                            let testObject = context.RandomObject;
                            legacyTransform = true;
                            strictEqual(await fileMapping.Transform(testObject), testObject);
                        });
                });
        });
}
