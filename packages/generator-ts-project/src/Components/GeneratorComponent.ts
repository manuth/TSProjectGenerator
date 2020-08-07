import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";

/**
 * Represents a component which belongs to a generator.
 */
export abstract class GeneratrorComponent<TSettings extends IGeneratorSettings, TResolved>
{
    /**
     * The generator of this component.
     */
    private generator: IGenerator<TSettings>;

    /**
     * Initializes a new instance of the `GeneratorComponent` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of this component.
     */
    public get Generator(): IGenerator<TSettings>
    {
        return this.generator;
    }

    /**
     * Gets the resolved representation of this object.
     */
    public abstract get Resolved(): TResolved;
}
