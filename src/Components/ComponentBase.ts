import { Component, IComponent, IFileMapping, IGenerator, Question, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratrorComponent } from "./GeneratorComponent";

/**
 * Provides a basic implementation of the `IComponent<T>` interface.
 */
export abstract class ComponentBase<T extends IGeneratorSettings> extends GeneratrorComponent<T, Component<T>> implements IComponent<T>
{
    /**
     * Initializes a new instance of the `ComponentBase<T>` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
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
    public get Questions(): Array<Question<T>>
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Promise<Array<IFileMapping<T>>>
    {
        return (
            async (): Promise<Array<IFileMapping<T>>> =>
            {
                return [];
            })();
    }

    /**
     * @inheritdoc
     */
    public get Resolved(): Component<T>
    {
        return new Component(this.Generator, this);
    }
}
