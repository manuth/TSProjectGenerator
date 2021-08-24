import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";

/**
 * Provides an implementation of the {@link JSONProcessor `JSONProcessor<TSettings, TOptions, TData>`} class for testing.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestJSONProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends JSONProcessor<TSettings, TOptions, any>
{
    /**
     * The data to return from the {@link TestJSONProcessor.Process `Process`} method.
     */
    private data: any;

    /**
     * Initializes a new instance of the {@link TestJSONProcessor `TestJSONProcessor<TSettings, TOptions>`} class.
     *
     * @param data
     * The data to return from the {@link TestJSONProcessor.Process `Process`} method.
     */
    public constructor(data: any)
    {
        super(null);
        this.data = data;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The predefined {@link TestJSONProcessor.data `data`}.
     */
    public override async Process(): Promise<any>
    {
        return this.data;
    }
}
