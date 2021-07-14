import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { readFile, writeFile } from "fs-extra";
import { SourceFile, VariableDeclarationKind } from "ts-morph";
import { TypeScriptTransformMapping } from "../../../Components/Transformation/TypeScriptTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(TypeScriptTransformMapping),
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TestTypeScriptTransformMapping;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TestTypeScriptTransformMapping>;
            let sourceCode: string;

            /**
             * Provides an implementation of the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptTransformMapping extends TypeScriptTransformMapping<ITestGeneratorSettings, GeneratorOptions>
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
                public override async Parse(text: string): Promise<SourceFile>
                {
                    return super.Parse(text);
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
                public override async Transform(data: SourceFile): Promise<SourceFile>
                {
                    data.getVariableStatements().forEach(
                        (variableStatement) =>
                        {
                            variableStatement.setDeclarationKind(VariableDeclarationKind.Const);
                        });

                    return data;
                }

                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to dump.
                 *
                 * @returns
                 * A text representing the {@link sourceFile `sourceFile`}.
                 */
                public override async Dump(sourceFile: SourceFile): Promise<string>
                {
                    return super.Dump(sourceFile);
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    sourceCode = dedent(
                        `
                            var a = 12;

                            var b = 13;`);

                    await writeFile(sourceFile.FullName, sourceCode);
                    fileMappingOptions = new TestTypeScriptTransformMapping();
                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            suite(
                nameof<TestTypeScriptTransformMapping>((mapping) => mapping.Parse),
                () =>
                {
                    test(
                        "Checking whether the file is parsed correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            strictEqual((await fileMappingOptions.Metadata).getFullText(), sourceCode);
                        });
                });

            suite(
                nameof<TestTypeScriptTransformMapping>((mapping) => mapping.Dump),
                () =>
                {
                    test(
                        "Checking whether the code is dumped correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            strictEqual((await readFile(destinationFile.FullName)).toString().trimEnd(), sourceCode.replace(/var/g, "const"));
                        });
                });
        });
}
