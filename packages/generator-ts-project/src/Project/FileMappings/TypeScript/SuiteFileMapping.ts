import { EOL } from "node:os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ArrowFunction, CallExpression, SourceFile, Statement, SyntaxKind, ts } from "ts-morph";
import { TypeScriptCreatorMapping } from "../../../Components/TypeScriptCreatorMapping.js";
import { ISuiteContext } from "./ISuiteContext.js";

/**
 * Provides the functionality to create a typescript-file containing a mocha-suite.
 */
export abstract class SuiteFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TypeScriptCreatorMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link SuiteFileMapping `SuiteFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The context of the file-mapping.
     */
    public abstract override Context(): Promise<ISuiteContext>;

    /**
     * Gets the name of the suite.
     *
     * @returns
     * The name of the suite.
     */
    public async GetSuiteName(): Promise<string>
    {
        return (await this.Context()).SuiteName;
    }

    /**
     * Gets the name of the suite function.
     *
     * @returns
     * he name of the suite function.
     */
    public async GetSuiteFunctionName(): Promise<string>
    {
        return (await this.Context()).SuiteFunctionName;
    }

    /**
     * Gets the function for registering the suite.
     *
     * @returns
     * The function for registering the suite.
     */
    protected async GetSuiteFunction(): Promise<ArrowFunction>
    {
        return this.WrapNode(ts.factory.createArrowFunction([], [], [], null, null, ts.factory.createBlock([])));
    }

    /**
     * Gets the call to the {@link suite `suite`}-method.
     *
     * @returns
     * The suite-call.
     */
    protected async GetSuiteCall(): Promise<CallExpression>
    {
        let suiteNameNode = this.WrapNode(ts.factory.createStringLiteral(""));
        let suiteFunction = await this.GetSuiteFunction();
        let suiteCall = this.WrapNode(ts.factory.createCallExpression(ts.factory.createIdentifier(nameof(suite)), [], []));
        suiteNameNode.setLiteralValue(await this.GetSuiteName());

        suiteCall.addArguments(
            [
                `${EOL}${suiteNameNode.getFullText()}`,
                `${EOL}${suiteFunction.getFullText()}`
            ]);

        suiteNameNode.forget();
        suiteFunction.forget();
        return suiteCall;
    }

    /**
     * Gets the main statement of the suite file.
     *
     * @returns The main statement of the suite file.
     */
    protected async GetMainStatement(): Promise<Statement>
    {
        let result: Statement;
        let suiteFunctionName = await this.GetSuiteFunctionName();
        let suiteCall = await this.GetSuiteCall();

        if (suiteFunctionName)
        {
            let suiteFunction = this.WrapNode(
                ts.factory.createFunctionDeclaration(
                    [],
                    undefined,
                    suiteFunctionName,
                    [],
                    [],
                    ts.factory.createKeywordTypeNode(SyntaxKind.VoidKeyword),
                    ts.factory.createBlock([])));

            suiteFunction.setIsExported(true);
            suiteFunction.setBodyText(suiteCall.getFullText());
            result = suiteFunction;
        }
        else
        {
            result = this.WrapExpression(suiteCall);
        }

        suiteCall.forget();
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
        let mainStatement = await this.GetMainStatement();
        sourceFile = await super.Transform(sourceFile);
        sourceFile.addStatements(mainStatement.getFullText());
        mainStatement.forget();
        return sourceFile;
    }
}
