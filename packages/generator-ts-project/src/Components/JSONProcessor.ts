import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratorComponent } from "./GeneratorComponent";

/**
 * Provides the functionality to process JSON-objects.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TData
 * The type of the data to process.
 */
export class JSONProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends GeneratorComponent<TSettings, TOptions, JSONProcessor<TSettings, TOptions, TData>>
{
    /**
     * Initializes a new instance of the {@link JSONProcessor `JSONProcessor<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the processor.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Resolved(): this
    {
        return this;
    }

    /**
     * Processes the specified {@link data `data`}.
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: TData): Promise<TData>
    {
        return data;
    }
}
