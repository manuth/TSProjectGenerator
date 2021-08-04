import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Document } from "yaml";
import { DumpCreatorFileMapping } from "./DumpCreatorFileMapping";
import { IDumper } from "./Transformation/Conversion/IDumper";
import { YAMLConverter } from "./Transformation/Conversion/YAMLConverter";

/**
 * Provides the functionality to create yaml-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class YAMLCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends DumpCreatorFileMapping<TSettings, TOptions, Array<Document | Document.Parsed>>
{
    /**
     * Initializes a new instance of the {@link YAMLCreatorMapping `YAMLCreatorMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param fileName
     * The name of the file to write the yaml-file to.
     *
     * @param data
     * The data to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileName: string, data: Array<Document | Document.Parsed>)
    {
        super(generator, fileName, data);
    }

    /**
     * @inheritdoc
     */
    public get Dumper(): IDumper<Array<Document | Document.Parsed>>
    {
        return new YAMLConverter();
    }
}
