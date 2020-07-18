import { IGeneratorSettings, IComponentCategory, IComponent } from "@manuth/extended-yo-generator";

/**
 * Represens a category of components.
 */
export abstract class ComponentCategoryBase<T extends IGeneratorSettings> implements IComponentCategory<T>
{
    /**
     * Initializes a new instance of the `ComponentCategoryBase<T>` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     */
    public abstract get DisplayName(): string;

    /**
     * @inheritdoc
     */
    public abstract get Components(): Array<IComponent<T>>;
}
