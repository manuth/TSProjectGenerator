import { strictEqual } from "node:assert";
import { EOL } from "node:os";
import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ArrowFunction, CallExpression, printNode, SourceFile, ts } from "ts-morph";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings.js";
import { SuiteFileMapping } from "./SuiteFileMapping.js";

/**
 * Provides the functionality to create a typescript-file containing a mocha-test in a mocha-suite.
 */
export abstract class TestFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends SuiteFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TestFileMapping `TestFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets an arrow-function for executing the tests.
     *
     * @returns
     * An arrow-function for executing the tests.
     */
    protected async GetTestExecutor(): Promise<ArrowFunction>
    {
        let executor = this.WrapNode(ts.factory.createArrowFunction([], [], [], null, null, ts.factory.createBlock([])));
        let assertion = this.WrapNode(ts.factory.createCallExpression(ts.factory.createIdentifier(nameof(strictEqual)), [], []));

        assertion.addArguments(
            [
                printNode(ts.factory.createNumericLiteral(1)),
                printNode(ts.factory.createNumericLiteral(1))
            ]);

        executor.addStatements(this.WrapExpression(assertion).getFullText());
        assertion.forget();
        return executor;
    }

    /**
     * Gets the call to the {@link test `test`}-method.
     *
     * @returns
     * The test-call.
     */
    protected async GetTestCall(): Promise<CallExpression>
    {
        let testCall = this.WrapNode(ts.factory.createCallExpression(ts.factory.createIdentifier(nameof(test)), [], []));
        let testNameNode = this.WrapNode(ts.factory.createStringLiteral(""));
        let executor = await this.GetTestExecutor();
        testNameNode.setLiteralValue("Example…");

        testCall.addArguments(
            [
                `${EOL}${testNameNode.getFullText()}`,
                `${EOL}${executor.getFullText()}`
            ]);

        testNameNode.forget();
        executor.forget();
        return testCall;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The function for registering the suite.
     */
    protected override async GetSuiteFunction(): Promise<ArrowFunction>
    {
        let result = await super.GetSuiteFunction();
        let testCall = await this.GetTestCall();
        let testExpression = this.WrapExpression(testCall);

        result.addStatements(
            [
                testExpression.getFullText()
            ]);

        testCall.forget();
        testExpression.forget();
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
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        sourceFile = await super.Transform(sourceFile);

        sourceFile.addImportDeclaration(
            {
                moduleSpecifier: "node:assert",
                namedImports: [
                    nameof(strictEqual)
                ]
            });

        return sourceFile;
    }
}
