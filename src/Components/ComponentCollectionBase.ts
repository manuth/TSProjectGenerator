import { IGeneratorSettings, IComponentCollection, IComponentCategory } from "@manuth/extended-yo-generator";

/**
 * Represents a collection of components.
 */
export abstract class ComponentCollectionBase<T extends IGeneratorSettings> implements IComponentCollection<T>
{
    /**
     * Initializes a new instance of the `ComponentCollectionBase<T>` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     */
    public abstract get Question(): string;

    /**
     * @inheritdoc
     */
    public abstract get Categories(): Array<IComponentCategory<T>>;
}
