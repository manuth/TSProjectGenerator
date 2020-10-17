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
 * Registers tests for the `YAMLTransformMapping` class.
 *
 * @param context
 * The text-context.
 */
export function YAMLTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "YAMLTransformMapping",
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>>;
            let sourceData: any;
            let randomData: any;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    fileMappingOptions = new class extends YAMLTransformMapping<ITestGeneratorSettings, GeneratorOptions>
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
                         * @param data
                         * The data to process.
                         *
                         * @returns
                         * The processed data.
                         */
                        public async Transform(data: Document.Parsed[]): Promise<Document.Parsed[]>
                        {
                            data.map(
                                (document) =>
                                {
                                    document.contents = randomData;
                                });

                            return data;
                        }
                    }();

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
                "General",
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

                    test(
                        "Checking whether the content is transformed correctly…",
                        async () =>
                        {
                            await tester.Run();
                            await tester.AssertContent(split(stringify(randomData)).join(EOL));
                        });
                });

            suite(
                "Multi-Document Handling",
                () =>
                {
                    test(
                        "Checking whether multi-document files are processed correctly…",
                        async () =>
                        {
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
