import { strictEqual } from "assert";
import { EOL } from "os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ArrowFunction, CallExpression, printNode, SourceFile, ts } from "ts-morph";
import { SuiteFileMapping } from "./SuiteFileMapping";

/**
 * Provides the functionality to create a typescript-file containing a mocha-test in a mocha-suite.
 */
export abstract class TestFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends SuiteFileMapping<TSettings, TOptions>
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
        let executor = this.Converter.WrapNode(ts.factory.createArrowFunction([], [], [], null, null, ts.factory.createBlock([])));
        let assertion = this.Converter.WrapNode(ts.factory.createCallExpression(ts.factory.createIdentifier(nameof(strictEqual)), [], []));

        assertion.addArguments(
            [
                printNode(ts.factory.createNumericLiteral(1)),
                printNode(ts.factory.createNumericLiteral(1))
            ]);

        executor.addStatements(this.Converter.WrapExpression(assertion).getFullText());
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
        let testCall = this.Converter.WrapNode(ts.factory.createCallExpression(ts.factory.createIdentifier(nameof(test)), [], []));
        let testNameNode = this.Converter.WrapNode(ts.factory.createStringLiteral(""));
        testNameNode.setLiteralValue("Example…");

        testCall.addArguments(
            [
                `${EOL}${testNameNode.getFullText()}`,
                `${EOL}${(await this.GetTestExecutor()).getFullText()}`
            ]);

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

        result.addStatements(
            [
                this.Converter.WrapExpression(await this.GetTestCall()).getFullText()
            ]);

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
                moduleSpecifier: "assert",
                namedImports: [
                    nameof(strictEqual)
                ]
            });

        return sourceFile;
    }
}
