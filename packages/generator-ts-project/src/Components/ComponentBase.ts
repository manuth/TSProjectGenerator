import { Component, GeneratorOptions, IComponent, IFileMapping, IGenerator, IGeneratorSettings, Question } from "@manuth/extended-yo-generator";
import { GeneratorComponent } from "./GeneratorComponent";

/**
 * Provides a basic implementation of the {@link IComponent `IComponent<TSettings, TOptions>`} interface.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class ComponentBase<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, Component<TSettings, TOptions>> implements IComponent<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ComponentBase `ComponentBase<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get ID(): string;

    /**
     * @inheritdoc
     */
    public abstract get DisplayName(): string;

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get Resolved(): Component<TSettings, TOptions>
    {
        return new Component(this.Generator, this);
    }
}
