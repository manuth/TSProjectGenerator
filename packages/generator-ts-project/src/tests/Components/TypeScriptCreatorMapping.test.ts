import { doesNotReject, doesNotThrow, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile, TempFileSystem } from "@manuth/temp-files";
import { CompilerNodeToWrappedType, Expression, ExpressionStatement, Project, SourceFile, ts } from "ts-morph";
import { TypeScriptCreatorMapping } from "../../Components/TypeScriptCreatorMapping";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class.
 */
export function TypeScriptCreatorMappingTests(): void
{
    suite(
        nameof(TypeScriptCreatorMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptCreatorMapping extends TypeScriptCreatorMapping<IGeneratorSettings, GeneratorOptions>
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
                 *
                 * @param node
                 * The node to wrap into a file.
                 *
                 * @returns
                 * The wrapped node.
                 */
                public override WrapNode<TNode extends ts.Node>(node: TNode): CompilerNodeToWrappedType<TNode>
                {
                    return super.WrapNode(node);
                }

                /**
                 * @inheritdoc
                 *
                 * @param expression
                 * The expression to wrap into an {@link ExpressionStatement `ExpressionStatement`}.
                 *
                 * @returns
                 * The wrapped {@link expression `expression`}.
                 */
                public override WrapExpression<TExpression extends Expression>(expression: TExpression): ExpressionStatement
                {
                    return super.WrapExpression(expression);
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let tempFile: TempFile;
            let fileMapping: TestTypeScriptCreatorMapping;

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
                    fileMapping = new TestTypeScriptCreatorMapping(generator);
                });

            teardown(
                () =>
                {
                    tempFile.Dispose();
                });

            suite(
                nameof(TypeScriptCreatorMapping.constructor),
                () =>
                {
                    test(
                        `Checking whether the argument containing the base \`${nameof<SourceFile>()}\` can be omitted…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    new TestTypeScriptCreatorMapping(generator);
                                });
                        });

                    test(
                        `Checking whether a base \`${nameof<SourceFile>()}\` can be passed…`,
                        () =>
                        {
                            doesNotThrow(
                                () =>
                                {
                                    new TestTypeScriptCreatorMapping(generator, new Project().createSourceFile(tempFile.FullName, null, { overwrite: true }));
                                });
                        });
                });

            suite(
                nameof<TestTypeScriptCreatorMapping>((fileMapping) => fileMapping.GetSourceObject),
                () =>
                {
                    test(
                        `Checking whether a new \`${nameof<SourceFile>()}\` is created if no \`${nameof<SourceFile>()}\` has been passed to the \`${nameof(TypeScriptCreatorMapping.constructor)}\`…`,
                        async () =>
                        {
                            strictEqual(
                                (await new TestTypeScriptCreatorMapping(generator).GetSourceObject()).getFilePath(),
                                new Project().createSourceFile(tempFile.FullName, null, { overwrite: true }).getFilePath());
                        });

                    test(
                        `Checking whether the \`${nameof<SourceFile>()}\` is loaded from the \`${nameof(TypeScriptCreatorMapping.constructor)}\`-parameter, if specified…`,
                        async () =>
                        {
                            let variableName = "test";
                            let sourceFile = new Project().createSourceFile(tempFile.FullName, null, { overwrite: true });

                            sourceFile.addVariableStatement(
                                {
                                    declarations: [
                                        {
                                            name: variableName
                                        }
                                    ]
                                });

                            await doesNotReject(
                                async () =>
                                {
                                    (await new TestTypeScriptCreatorMapping(generator, sourceFile).GetSourceObject()).getVariableDeclarationOrThrow(variableName);
                                });
                        });
                });

            suite(
                nameof<TestTypeScriptCreatorMapping>((fileMapping) => fileMapping.WrapNode),
                () =>
                {
                    test(
                        "Checking whether nodes can be added to a source-file correctly…",
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let node = fileMapping.WrapNode(ts.factory.createArrowFunction([], [], [], null, null, ts.factory.createBlock([])));

                            doesNotThrow(
                                () =>
                                {
                                    node.addParameter(
                                        {
                                            name: "test"
                                        });
                                });
                        });

                    test(
                        "Checking whether nodes which already belong to a file are treated correctly…",
                        function()
                        {
                            let project = new Project();
                            let sourceFile = project.createSourceFile(TempFileSystem.TempName());
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            let testClass = sourceFile.addClass(
                                {
                                    name: "Test"
                                });

                            strictEqual(fileMapping.WrapNode(testClass.compilerNode).getSourceFile().compilerNode, sourceFile.compilerNode);
                            sourceFile.forget();
                        });
                });

            suite(
                nameof<TestTypeScriptCreatorMapping>((converter) => converter.WrapExpression),
                () =>
                {
                    test(
                        "Checking whether expressions can be wrapped into extension-statements…",
                        function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            let callExpression = fileMapping.WrapNode(
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier(nameof(console)),
                                        nameof(console.log)),
                                    [],
                                    [
                                        ts.factory.createStringLiteral("hello world")
                                    ]));

                            strictEqual(fileMapping.WrapExpression(callExpression).getExpression().getFullText(), callExpression.getFullText());
                        });
                });
        });
}
