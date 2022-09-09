import { doesNotThrow, ok, strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TempFile } from "@manuth/temp-files";
import RandExp from "randexp";
import { ArrowFunction, CallExpression, FunctionDeclaration, Node, SourceFile, SyntaxKind, ts } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { ISuiteFunctionInfo } from "../../../../Project/FileMappings/TypeScript/ISuiteFunctionInfo.js";
import { SuiteFileMapping } from "../../../../Project/FileMappings/TypeScript/SuiteFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";

const { randexp } = RandExp;

/**
 * Registers tests for the {@link SuiteFileMapping `SuiteFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function SuiteFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(SuiteFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link SuiteFileMapping `SuiteFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestSuiteFileMapping extends SuiteFileMapping<ITSProjectSettings, GeneratorOptions>
            {
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
                 * @returns
                 * The context of the file-mapping.
                 */
                public async Context(): Promise<ISuiteContext>
                {
                    return {
                        SuiteName: suiteName,
                        get SuiteFunction()
                        {
                            return suiteFunctionInfo;
                        }
                    };
                }

                /**
                 * Gets the function for registering the suite.
                 *
                 * @returns
                 * The function for registering the suite.
                 */
                public override async GetSuiteFunction(): Promise<ArrowFunction>
                {
                    let result = await super.GetSuiteFunction();

                    result.addStatements(
                        this.WrapExpression(
                            this.WrapNode(ts.factory.createStringLiteral(testValue))).getFullText());

                    return result;
                }

                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    this.Dispose();
                    return super.Transform(sourceFile);
                }
            }

            let generator: TSProjectGenerator;
            let suiteName: string;
            let suiteFunctionInfo: ISuiteFunctionInfo;
            let outputFile: TempFile;
            let testValue: string;
            let fileMapping: TestSuiteFileMapping;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    suiteName = context.RandomString;
                    suiteFunctionInfo = null;

                    outputFile = new TempFile(
                        {
                            Suffix: ".ts"
                        });

                    testValue = context.RandomString;
                    fileMapping = new TestSuiteFileMapping(generator);
                });

            teardown(
                () =>
                {
                    outputFile.Dispose();
                });

            suite(
                nameof<TestSuiteFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    let files: SourceFile[];

                    setup(
                        () =>
                        {
                            files = [];
                        });

                    teardown(
                        () =>
                        {
                            for (let file of files)
                            {
                                file.forget();
                            }
                        });

                    /**
                     * Gets the {@link suite `suite`} calls inside the specified {@link node `node`}.
                     *
                     * @param node
                     * The node to get the {@link suite `suite`} calls from.
                     *
                     * @returns
                     * The {@link suite `suite`} calls inside the specified {@link node `node`}.
                     */
                    function GetDescendantSuiteCalls(node: Node): CallExpression[]
                    {
                        return node.getDescendantsOfKind(
                            SyntaxKind.CallExpression).filter(
                                (callExpression) =>
                                {
                                    return callExpression.getExpression().getText() === nameof(suite);
                                });
                    }

                    /**
                     * Gets all calls to the {@link suite `suite`}-method.
                     *
                     * @returns
                     * All calls to the {@link suite `suite`}-method.
                     */
                    async function GetSuiteCalls(): Promise<CallExpression[]>
                    {
                        let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                        files.push(sourceFile);
                        return GetDescendantSuiteCalls(sourceFile);
                    }

                    /**
                     * Gets the first call to the {@link suite `suite`}-method.
                     *
                     * @returns
                     * The first call to the {@link suite `suite`}-method.
                     */
                    async function GetSuiteCall(): Promise<CallExpression>
                    {
                        return (await GetSuiteCalls())[0];
                    }

                    test(
                        `Checking whether a call to mocha's \`${nameof(suite)}\` is present…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            strictEqual((await GetSuiteCalls()).length, 1);
                        });

                    test(
                        `Checking whether the name of the suite is set according to \`${nameof<TestSuiteFileMapping>((fm) => fm.GetSuiteName)}\`…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual(
                                (await GetSuiteCall()).getArguments()[0].asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue(),
                                await fileMapping.GetSuiteName());
                        });

                    test(
                        "Checking whether the suite can be generated inside a named function…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            suiteFunctionInfo = {
                                Name: randexp(/[a-zA-Z][a-zA-Z0-9]{9}/),
                                Description: context.RandomString
                            };

                            let sourceFile = await fileMapping.Transform(await fileMapping.GetSourceObject());
                            let suiteFunction: FunctionDeclaration;
                            doesNotThrow(() => suiteFunction = sourceFile.getFunctionOrThrow(suiteFunctionInfo.Name));
                            ok(suiteFunction.isExported());
                            strictEqual(suiteFunction.getJsDocs()[0].getDescription().trim(), suiteFunctionInfo.Description.trim());
                            strictEqual(GetDescendantSuiteCalls(suiteFunction).length, 1);
                        });

                    test(
                        `Checking whether the contents of the suite can be adjusted using \`${nameof<TestSuiteFileMapping>((fm) => fm.GetSuiteFunction)}\`…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual(
                                (await GetSuiteCall()).getArguments()[1].asKindOrThrow(SyntaxKind.ArrowFunction).getDescendantsOfKind(
                                    SyntaxKind.StringLiteral).filter(
                                        (stringLiteral) =>
                                        {
                                            return stringLiteral.getLiteralValue() === testValue;
                                        }).length,
                                1);
                        });
                });
        });
}
