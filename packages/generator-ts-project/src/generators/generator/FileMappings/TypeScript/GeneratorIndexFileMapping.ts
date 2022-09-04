import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { printNode, SourceFile, ts } from "ts-morph";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { GeneratorTypeScriptMapping } from "./GeneratorTypeScriptMapping.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create an index-file for a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class GeneratorIndexFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends GeneratorTypeScriptMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link GeneratorIndexFileMapping `GeneratorIndexFileMapping<TSettings, TOptions>`} class.
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
        return this.NamingContext.GeneratorIndexFileName;
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
                ...await this.GetImportDeclaration(this.NamingContext.GeneratorClassFileName),
                namedImports: [
                    this.NamingContext.GeneratorClassName
                ]
            });

        sourceFile.addExportAssignment(
            this.GetMainExportDeclaration(
                printNode(ts.factory.createIdentifier(this.NamingContext.GeneratorClassName))));

        return sourceFile;
    }
}
