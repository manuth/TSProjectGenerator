import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Project, SourceFile } from "ts-morph";
import { DumpCreatorFileMapping } from "./DumpCreatorFileMapping";
import { IDumper } from "./Transformation/Conversion/IDumper";
import { TypeScriptConverter } from "./Transformation/Conversion/TypeScriptConverter";

/**
 * Provides the functionality to create typescript-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class TypeScriptCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends DumpCreatorFileMapping<TSettings, TOptions, SourceFile>
{
    /**
     * Initializes a new instance of the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param sourceFile
     * The sourceFile to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, sourceFile?: SourceFile)
    {
        super(generator, null, sourceFile);
    }

    /**
     * @inheritdoc
     */
    public abstract override get Destination(): string;

    /**
     * @inheritdoc
     */
    public get Converter(): TypeScriptConverter
    {
        return new TypeScriptConverter(this.Resolved.Destination);
    }

    /**
     * @inheritdoc
     */
    public get Dumper(): IDumper<SourceFile>
    {
        return new TypeScriptConverter(this.Resolved.Destination);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The source-file to dump.
     */
    public override async GetSourceObject(): Promise<SourceFile>
    {
        let result = await super.GetSourceObject();

        return result ??
            new Project().createSourceFile(this.Resolved.Destination, null, { overwrite: true });
    }

    /**
     * Processes the specified {@link sourceFile `sourceFile`}.
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed data.
     */
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        return super.Transform(sourceFile);
    }
}
