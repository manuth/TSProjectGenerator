import { strictEqual } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { CallExpression, SourceFile, SyntaxKind } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { TestFileMapping } from "../../../../Project/FileMappings/TypeScript/TestFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";

/**
 * Registers tests for the {@link TestFileMapping `TestFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TestFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TestFileMapping),
        () =>
        {
            /**
             * Provides an implementation of the {@link TestFileMapping `TestFileMapping<TSettings, TOptions>`} class.
             */
            class TestTestFileMapping extends TestFileMapping<ITSProjectSettings, GeneratorOptions>
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
            let outputFile: TempFile;
            let fileMapping: TestTestFileMapping;
            let unitTestName = "Example…";

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

                    fileMapping = new TestTestFileMapping(generator);
                });

            teardown(
                () =>
                {
                    outputFile.Dispose();
                });

            suite(
                nameof<TestTestFileMapping>((fileMapping) => fileMapping.Transform),
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
                     * Gets all calls to mocha's {@link test `test`}-method.
                     *
                     * @returns
                     * All calls to mocha's {@link test `test`}-method.
                     */
                    async function GetTestCalls(): Promise<CallExpression[]>
                    {
                        let file = await fileMapping.Transform(await fileMapping.GetSourceObject());
                        files.push(file);

                        let suiteCalls = file.getDescendantsOfKind(SyntaxKind.CallExpression).filter(
                            (callExpression) =>
                            {
                                return callExpression.getExpression().getText() === nameof(suite) &&
                                    (callExpression.getArguments()[0].asKind(SyntaxKind.StringLiteral)?.getLiteralValue() ?? null) === suiteName;
                            });

                        strictEqual(suiteCalls.length, 1);
                        let suiteCall = suiteCalls[0];

                        return suiteCall.getDescendantsOfKind(SyntaxKind.CallExpression).filter(
                            (callExpression) =>
                            {
                                return callExpression.getExpression().getText() === nameof(test);
                            });
                    }

                    /**
                     * Gets the first call to mocha's {@link test `test`}-method.
                     *
                     * @returns
                     * The first call to mocha's {@link test `test`}-method.
                     */
                    async function GetTestCall(): Promise<CallExpression>
                    {
                        return (await GetTestCalls())[0];
                    }

                    test(
                        `Checking whether a default unit-test named \`${unitTestName}\` is present…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual((await GetTestCalls()).length, 1);

                            strictEqual(
                                (await GetTestCall()).getArguments()[0].asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue(),
                                unitTestName);
                        });

                    test(
                        "Checking whether a default assertion exists inside the unit-test…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            strictEqual(
                                (await GetTestCall()).getArguments()[1].asKindOrThrow(SyntaxKind.ArrowFunction).getDescendantsOfKind(SyntaxKind.CallExpression).filter(
                                    (callExpression) =>
                                    {
                                        return callExpression.getExpression().getText() === nameof(strictEqual) &&
                                            callExpression.getArguments().length === 2 &&
                                            callExpression.getArguments()[0].getText() === callExpression.getArguments()[1].getText();
                                    }).length,
                                1);
                        });
                });
        });
}
