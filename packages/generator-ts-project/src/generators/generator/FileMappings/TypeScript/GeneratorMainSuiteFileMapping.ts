import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ArrowFunction, printNode, SourceFile, ts } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey.js";
import { GeneratorSuiteFileMappingBase } from "./GeneratorSuiteFileMappingBase.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create the main test-file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorMainSuiteFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends GeneratorSuiteFileMappingBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link GeneratorMainSuiteFileMapping `GeneratorMainTestFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param namingContext
     * A component which provides constants for the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, namingContext: NamingContext)
    {
        super(generator, namingContext);
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.NamingContext.MainSuiteFileName;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The context.
     */
    public async Context(): Promise<ISuiteContext>
    {
        return {
            SuiteName: this.Generator.Settings[TSProjectSettingKey.DisplayName]
        };
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
            printNode(
                ts.factory.createCallExpression(
                    ts.factory.createIdentifier(this.NamingContext.GeneratorSuiteFunctionName),
                    [],
                    [])));

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
        let result = await super.Transform(sourceFile);

        result.addImportDeclaration(
            {
                ...await this.GetImportDeclaration(this.NamingContext.GeneratorSuiteFileName),
                namedImports: [
                    this.NamingContext.GeneratorSuiteFunctionName
                ]
            });

        return result;
    }
}
