import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Represents a component which belongs to a generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class GeneratorComponent<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TResolved>
{
    /**
     * The generator of this component.
     */
    private generator: IGenerator<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link GeneratorComponent `GeneratorComponent<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of this component.
     */
    public get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.generator;
    }

    /**
     * Gets the resolved representation of this object.
     */
    public abstract get Resolved(): TResolved;
}
