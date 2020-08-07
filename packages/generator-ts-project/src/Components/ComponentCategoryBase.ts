import { IGeneratorSettings, IComponentCategory, IComponent, IGenerator, ComponentCategory } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Represens a category of components.
 */
export abstract class ComponentCategoryBase<T extends IGeneratorSettings> extends GeneratrorComponent<T, ComponentCategory<T>> implements IComponentCategory<T>
{
    /**
     * Initializes a new instance of the `ComponentCategoryBase<T>` class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get DisplayName(): string;

    /**
     * @inheritdoc
     */
    public abstract get Components(): Array<IComponent<T>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCategory<T>
    {
        return new ComponentCategory(this.Generator, this);
    }
}
