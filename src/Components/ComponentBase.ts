import { Component, IComponent, IFileMapping, IGenerator, Question } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../Project/ITSProjectSettings";

/**
 * Provides a basic implementation of the `IComponent<T>` interface.
 */
export abstract class ComponentBase<T extends ITSProjectSettings> implements IComponent<T>
{
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
