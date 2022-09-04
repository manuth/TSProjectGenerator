import { Generator, GeneratorOptions } from "@manuth/extended-yo-generator";
import { ArrowFunction, ImportDeclarationStructure, OptionalKind, printNode, SourceFile, StatementStructures, ts, WriterFunction } from "ts-morph";
import { ISuiteContext } from "../../../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { GeneratorSuiteFileMappingBase } from "./GeneratorSuiteFileMappingBase.js";
import { GeneratorTestFileMapping } from "./GeneratorTestFileMapping.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create a file which contains test-suites for generators.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorSuiteFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends GeneratorSuiteFileMappingBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link GeneratorSuiteFileMapping `GeneratorSuiteFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param namingContext
     * A component which provides constants for the file-mapping.
     */
    public constructor(generator: Generator<TSettings, TOptions>, namingContext: NamingContext)
    {
        super(generator, namingContext);
    }

    /**
     * @inheritdoc
     */
    public override get Generator(): Generator<TSettings, TOptions>
    {
        return super.Generator as Generator<TSettings, TOptions>;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.NamingContext.GeneratorSuiteFileName;
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
            SuiteName: "Generators",
            SuiteFunctionName: this.NamingContext.GeneratorSuiteFunctionName
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
        let statements: Array<string | WriterFunction | StatementStructures> = [];

        for (let fileMapping of this.Generator.FileMappingCollection.Items)
        {
            if (fileMapping.Object instanceof GeneratorTestFileMapping)
            {
                let suiteFunctionName = await fileMapping.Object.GetSuiteFunctionName();

                statements.push(
                    printNode(
                        ts.factory.createCallExpression(
                            ts.factory.createIdentifier(suiteFunctionName),
                            [],
                            [])));
            }
        }

        result.addStatements(statements);
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
        let importDeclarations: Array<OptionalKind<ImportDeclarationStructure>> = [];

        for (let fileMapping of this.Generator.FileMappingCollection.Items)
        {
            if (fileMapping.Object instanceof GeneratorTestFileMapping)
            {
                let suiteFunctionName = await fileMapping.Object.GetSuiteFunctionName();

                importDeclarations.push(
                    {
                        ...await this.GetImportDeclaration(fileMapping.Destination),
                        namedImports: [
                            suiteFunctionName
                        ]
                    });
            }
        }

        result.addImportDeclarations(importDeclarations);
        return result;
    }
}
