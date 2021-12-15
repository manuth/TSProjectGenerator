import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { ArrowFunction, CallExpression, SourceFile, SyntaxKind, ts } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext";
import { SuiteFileMapping } from "../../../../Project/FileMappings/TypeScript/SuiteFileMapping";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link SuiteFileMapping `SuiteFileMapping<TSettings, TOptions>`} class.
 */
export function SuiteFileMappingTests(): void
{
    suite(
        nameof(SuiteFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link SuiteFileMapping `SuiteFileMapping<TSettings, TOptions>`} class for testing.
             */
            class TestSuiteFileMapping extends SuiteFileMapping<IGeneratorSettings, GeneratorOptions>
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
                        SuiteName: suiteName
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
                        this.Converter.WrapExpression(
                            this.Converter.WrapNode(ts.factory.createStringLiteral(testValue))).getFullText());

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
                    return super.Transform(sourceFile);
                }
            }

            let context = TestContext.Default;
            let generator: TestGenerator;
            let suiteName: string;
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
                    /**
                     * Gets all calls to the {@link suite `suite`}-method.
                     *
                     * @returns
                     * All calls to the {@link suite `suite`}-method.
                     */
                    async function GetSuiteCalls(): Promise<CallExpression[]>
                    {
                        return (await fileMapping.Transform(await fileMapping.GetSourceObject())).getDescendantsOfKind(
                            SyntaxKind.CallExpression).filter(
                                (callExpression) =>
                                {
                                    return callExpression.getExpression().getText() === nameof(suite);
                                });
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
