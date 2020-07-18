import { Component, IComponent, IFileMapping, IGenerator, Question, IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Provides a basic implementation of the `IComponent<T>` interface.
 */
export abstract class ComponentBase<T extends IGeneratorSettings> implements IComponent<T>
{
    /**
     * Initializes a new instance of the `ComponentBase<T>` class.
     */
    public constructor()
    { }

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
     *
     * @param component
     * The resolved representation of this component.
     *
     * @param generator
     * The generator of this component
     *
     * @returns
     * The file-mappings of this component.
     */
    public async FileMappings(component: Component<T>, generator: IGenerator<T>): Promise<Array<IFileMapping<T>>>
    {
        return [];
    }
}
