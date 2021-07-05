import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONTransformMapping } from "./Transformation/JSONTransformMapping";

/**
 * Provides the functionality to create a json-file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class JSONCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends JSONTransformMapping<TSettings, TOptions, any>
{
    /**
     * The data to write.
     */
    private data: any;

    /**
     * The destination to save the file to.
     */
    private destination: string;

    /**
     * Initializes a new instance of the {@link JSONCreatorMapping `JSONCreatorMapping<TSettings, TOptions>`} class.
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
        super(generator);
        this.destination = fileName;
        this.data = data;
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.destination;
    }

    /**
     * @inheritdoc
     */
    public override get Metadata(): Promise<any>
    {
        return this.data;
    }
}
