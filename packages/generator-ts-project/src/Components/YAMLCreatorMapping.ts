import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Document, parseDocument } from "yaml";
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
export class YAMLCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends DumpCreatorFileMapping<TSettings, TOptions, Document.Parsed[]>
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
    public constructor(generator: IGenerator<TSettings, TOptions>, fileName: string, data: Document[])
    {
        super(
            generator,
            fileName,
            data.map(
                (document) =>
                {
                    return parseDocument(document.toString());
                }));
    }

    /**
     * @inheritdoc
     */
    public get Dumper(): IDumper<Document.Parsed[]>
    {
        return new YAMLConverter();
    }
}
