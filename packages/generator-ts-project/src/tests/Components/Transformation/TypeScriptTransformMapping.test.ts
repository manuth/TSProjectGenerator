import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { writeFile, readFile } from "fs-extra";
import { TempFile } from "temp-filesystem";
import { SourceFile, VariableDeclarationKind } from "ts-morph";
import { TypeScriptTransformMapping } from "../../../Components/Transformation/TypeScriptTransformMapping";
import { TestContext } from "../../TestContext";
import { FileMappingTester } from "../FileMappingTester";

/**
 * Registers tests for the `TypeScriptTransformMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "TypeScriptTransformMapping",
        () =>
        {
            let generator: TestGenerator;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: TypeScriptTransformMapping<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, TypeScriptTransformMapping<ITestGeneratorSettings, GeneratorOptions>>;
            let sourceCode: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    sourceCode = dedent(
                        `
                            var a = 12;

                            var b = 13;`);

                    await writeFile(sourceFile.FullName, sourceCode);

                    fileMappingOptions = new class extends TypeScriptTransformMapping<ITestGeneratorSettings, GeneratorOptions>
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
                        public get Source(): Promise<string>
                        {
                            return context.CreatePromise(sourceFile.FullName);
                        }

                        /**
                         * @inheritdoc
                         */
                        public get Destination(): Promise<string>
                        {
                            return context.CreatePromise(destinationFile.FullName);
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
                        public async Transform(data: SourceFile): Promise<SourceFile>
                        {
                            data.getVariableStatements().forEach(
                                (variableStatement) =>
                                {
                                    variableStatement.setDeclarationKind(VariableDeclarationKind.Const);
                                });

                            return data;
                        }
                    }();

                    tester = new FileMappingTester(generator, fileMappingOptions);
                });

            suiteTeardown(
                () =>
                {
                    sourceFile.Dispose();
                    destinationFile.Dispose();
                });

            test(
                "Checking whether the file is parsed correctly…",
                async () =>
                {
                    Assert.strictEqual((await fileMappingOptions.Metadata).getFullText(), sourceCode);
                });

            test(
                "Checking whether the code can be transformed as expected…",
                async () =>
                {
                    await tester.Run();
                    Assert.strictEqual((await readFile(destinationFile.FullName)).toString(), sourceCode.replace(/var/g, "const"));
                });
        });
}
