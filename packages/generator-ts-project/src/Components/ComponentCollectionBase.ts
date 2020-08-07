import { IGeneratorSettings, IComponentCollection, IComponentCategory, IGenerator, ComponentCollection } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Represents a collection of components.
 */
export abstract class ComponentCollectionBase<T extends IGeneratorSettings> extends GeneratrorComponent<T, ComponentCollection<T>> implements IComponentCollection<T>
{
    /**
     * Initializes a new instance of the `ComponentCollectionBase<T>` class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: IGenerator<T>)
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
    public abstract get Categories(): Array<IComponentCategory<T>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCollection<T>
    {
        return new ComponentCollection(this.Generator, this);
    }
}
