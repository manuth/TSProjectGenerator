import { GeneratorOptions, IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Provides the functionality to process JSON-objects.
 */
export class JSONProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends GeneratrorComponent<TSettings, TOptions, null>
{
    /**
     * Initializes a new instance of the `JSONProcessor` class.
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
    public get Resolved(): null
    {
        return null;
    }

    /**
     * Processes the specified `data`.
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
