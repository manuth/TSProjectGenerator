import { ComponentCategory, GeneratorOptions, IComponent, IComponentCategory, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Represens a category of components.
 */
export abstract class ComponentCategoryBase<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratrorComponent<TSettings, TOptions, ComponentCategory<TSettings, TOptions>> implements IComponentCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `ComponentCategoryBase` class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
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
    public abstract get Components(): Array<IComponent<TSettings, TOptions>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCategory<TSettings, TOptions>
    {
        return new ComponentCategory(this.Generator, this);
    }
}
