import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import dedent from "dedent";
import fs from "fs-extra";
import { SourceFile, VariableDeclarationKind } from "ts-morph";
import { TypeScriptTransformMapping } from "../../../Components/Transformation/TypeScriptTransformMapping.js";
import { TestContext } from "../../TestContext.js";

const { writeFile } = fs;

/**
 * Registers tests for the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class.
 */
export function TypeScriptTransformMappingTests(): void
{
    suite(
        nameof(TypeScriptTransformMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let outputFile: TempFile;
            let fileMappingOptions: TestTypeScriptTransformMapping;
            let tester: TypeScriptFileMappingTester<TestGenerator, IGeneratorSettings, GeneratorOptions, TestTypeScriptTransformMapping>;
            let sourceCode: string;

            /**
             * Provides an implementation of the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptTransformMapping extends TypeScriptTransformMapping<IGeneratorSettings, GeneratorOptions>
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
                    return outputFile.FullName;
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
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    outputFile = new TempFile();

                    sourceCode = dedent(
                        `
                            var a = 12;

                            var b = 13;`);

                    await writeFile(sourceFile.FullName, sourceCode);
                    fileMappingOptions = new TestTypeScriptTransformMapping();
                    tester = new TypeScriptFileMappingTester(generator, fileMappingOptions);
                });

            suite(
                nameof<TestTypeScriptTransformMapping>((mapping) => mapping.Transform),
                () =>
                {
                    test(
                        "Checking whether the code is transformed correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            strictEqual((await tester.ReadOutput()).trimEnd(), sourceCode.replace(/var/g, "const").trimEnd());
                        });
                });
        });
}
