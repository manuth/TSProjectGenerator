import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DumpCreatorFileMapping } from "./DumpCreatorFileMapping";
import { IDumper } from "./Transformation/Conversion/IDumper";
import { JSONCConverter } from "./Transformation/Conversion/JSONCConverter";

/**
 * Provides the functionality to create a json-file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class JSONCCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends DumpCreatorFileMapping<TSettings, TOptions, TData>
{
    /**
     * Initializes a new instance of the {@link JSONCCreatorMapping `JSONCreatorMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param fileName
     * The name of the file to write the json-file to.
     *
     * @param data
     * The data to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileName: string, data: any)
    {
        super(generator, fileName, data);
    }

    /**
     * @inheritdoc
     */
    public get Dumper(): IDumper<TData>
    {
        return new JSONCConverter();
    }
}
