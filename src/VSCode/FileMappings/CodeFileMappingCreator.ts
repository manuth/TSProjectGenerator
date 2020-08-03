import { IGeneratorSettings, IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";

/**
 * Provides the functionality to create file-mappings for a code workspace.
 */
export abstract class CodeFileMappingCreator<T extends IGeneratorSettings>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<T>;

    /**
     * Initializes a new instance of the `CodeFileMappingCreator` class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        this.component = component;
    }

    /**
     * Gets the component of this file-mapping creator.
     */
    public get Component(): CodeWorkspaceComponent<T>
    {
        return this.component;
    }

    /**
     * Gets the generator of this file-mapping creator.
     */
    public get Generator(): IGenerator<T>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the file-mappings for creating the workspace.
     */
    public abstract get FileMappings(): Promise<Array<IFileMapping<T>>>;
}
