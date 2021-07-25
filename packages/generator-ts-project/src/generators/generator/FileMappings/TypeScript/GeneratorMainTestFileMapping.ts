import { dirname, relative } from "path";
import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ArrowFunction, printNode, ts } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { GeneratorSuiteFileMappingBase } from "./GeneratorSuiteFileMappingBase";
import { NamingContext } from "./NamingContext";

/**
 * Provides the functionality to create the main test-file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorMainTestFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends GeneratorSuiteFileMappingBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link GeneratorMainTestFileMapping `GeneratorMainTestFileMapping<TSettings, TOptions>`} class.
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
                ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                        ts.factory.createIdentifier(nameof(require)),
                        [],
                        [
                            ts.factory.createStringLiteral(
                                (await this.GetSourceObject()).getRelativePathAsModuleSpecifierTo(
                                    relative(
                                        dirname(this.Destination),
                                        this.NamingContext.GeneratorSuiteFileName)))
                        ]))));

        return result;
    }
}
