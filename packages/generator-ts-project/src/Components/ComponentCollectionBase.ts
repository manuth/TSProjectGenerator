import { ComponentCollection, GeneratorOptions, IComponentCategory, IComponentCollection, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Represents a collection of components.
 */
export abstract class ComponentCollectionBase<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratrorComponent<TSettings, TOptions, ComponentCollection<TSettings, TOptions>> implements IComponentCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `ComponentCollectionBase` class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get Question(): string;

    /**
     * @inheritdoc
     */
    public abstract get Categories(): Array<IComponentCategory<TSettings, TOptions>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCollection<TSettings, TOptions>
    {
        return new ComponentCollection(this.Generator, this);
    }
}
