import { deepStrictEqual, ok, strictEqual } from "assert";
import { EOL } from "os";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { split } from "eol";
import { writeFile } from "fs-extra";
import { Document, parse, parseAllDocuments, stringify } from "yaml";
import { YAMLTransformMapping } from "../../../Components/Transformation/YAMLTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The text-context.
 */
export function YAMLTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(YAMLTransformMapping),
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TestYAMLTransformMapping;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestYAMLTransformMapping>;
            let sourceData: any;
            let randomData: any;

            /**
             * Provides an implementation of the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class for testing.
             */
            class TestYAMLTransformMapping extends YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>
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
                public get Source(): string
                {
                    return sourceFile.FullName;
                }

                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return destinationFile.FullName;
                }

                /**
                 * @inheritdoc
                 *
                 * @param text
                 * The text representing the meta-data.
                 *
                 * @returns
                 * An object loaded from the specified {@link text `text`}.
                 */
                public override async Parse(text: string): Promise<Document.Parsed[]>
                {
                    return super.Parse(text);
                }

                /**
                 * @inheritdoc
                 *
                 * @param data
                 * The metadata to dump.
                 *
                 * @returns
                 * A text representing the specified {@link data `data`}.
                 */
                public override async Dump(data: Document.Parsed[]): Promise<string>
                {
                    return super.Dump(data);
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
                public override async Transform(data: Document.Parsed[]): Promise<Document.Parsed[]>
                {
                    data.map(
                        (document) =>
                        {
                            document.contents = randomData;
                        });

                    return data;
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();
                    fileMappingOptions = new TestYAMLTransformMapping();
                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            setup(
                async () =>
                {
                    sourceData = context.RandomObject;
                    randomData = context.RandomObject;
                    await writeFile(sourceFile.FullName, stringify(sourceData));
                });

            suite(
                nameof<TestYAMLTransformMapping>((mapping) => mapping.Parse),
                () =>
                {
                    test(
                        "Checking whether the content is parsed correctly…",
                        async () =>
                        {
                            deepStrictEqual(
                                parse((await fileMappingOptions.Metadata).map(
                                    (document) =>
                                    {
                                        return document.toString();
                                    }).join("---\n")),
                                sourceData);
                        });
                });

            suite(
                nameof<TestYAMLTransformMapping>((mapping) => mapping.Dump),
                () =>
                {
                    test(
                        "Checking whether the content is transformed correctly…",
                        async () =>
                        {
                            await tester.Run();
                            await tester.AssertContent(split(stringify(randomData)).join(EOL));
                        });

                    test(
                        "Checking whether multi-document files are processed correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);

                            await writeFile(sourceFile.FullName,
                                dedent(
                                    `
                                            ---
                                            ---`));

                            await tester.Run();
                            let documents = parseAllDocuments(await tester.Content);
                            strictEqual(documents.length, 2);

                            for (let document of documents)
                            {
                                deepStrictEqual(parse(document.toString()), randomData);
                            }
                        });

                    test(
                        "Checking whether leading `---` are skipped if not present in the source…",
                        async () =>
                        {
                            await writeFile(sourceFile.FullName,
                                dedent(
                                    `
                                            hello: world
                                            ---
                                            hello: world`));

                            await tester.Run();
                            let documents = parseAllDocuments(await tester.Content);
                            strictEqual(documents.length, 2);
                            ok(!(await tester.Content).startsWith("---"));
                        });
                });
        });
}
