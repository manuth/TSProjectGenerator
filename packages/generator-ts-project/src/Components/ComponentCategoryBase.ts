import { ComponentCategory, GeneratorOptions, IComponent, IComponentCategory, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratorComponent } from "./GeneratorComponent";

/**
 * Represens a category of components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class ComponentCategoryBase<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, ComponentCategory<TSettings, TOptions>> implements IComponentCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ComponentCategoryBase `ComponentCategoryBase<TSettings, TOptions>`} class.
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
