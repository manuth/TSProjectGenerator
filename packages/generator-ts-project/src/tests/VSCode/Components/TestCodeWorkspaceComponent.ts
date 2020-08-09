import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "../../../VSCode/FileMappings/CodeFileMappingCreator";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { TestCodeWorkspaceProvider } from "../FileMappings/TestCodeWorkspaceProvider";
import { TestWorkspaceProcessor } from "./TestWorkspaceProcessor";

/**
 * Provides an implementation of the `CodeWorkspaceComponent` class for testing.
 */
export class TestCodeWorkspaceComponent<T extends IGeneratorSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * A component for loading vscode-workspaces.
     */
    private source: TestCodeWorkspaceProvider<T> = new TestCodeWorkspaceProvider(this);

    /**
     * A component for creating file-mappings.
     */
    private fileMappingCreator: CodeFileMappingCreator<T> = new WorkspaceFolderCreator(this);

    /**
     * A component for processing workspaces.
     */
    private workspaceProcessor: TestWorkspaceProcessor<T> = new TestWorkspaceProcessor(this);

    /**
     * Initializes a new instance of the `TestCodeWorkspaceComponent` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * Gets or sets a component for loading vscode-workspaces.
     */
    public get Source(): TestCodeWorkspaceProvider<T>
    {
        return this.source;
    }

    /**
     * @inheritdoc
     */
    public set Source(value: TestCodeWorkspaceProvider<T>)
    {
        this.source = value;
    }

    /**
     * Gets or sets a component for creating file-mappings.
     */
    public get FileMappingCreator(): CodeFileMappingCreator<T>
    {
        return this.fileMappingCreator;
    }

    /**
     * @inheritdoc
     */
    public set FileMappingCreator(value: CodeFileMappingCreator<T>)
    {
        this.fileMappingCreator = value;
    }

    /**
     * Gets or sets a component for processing workspaces.
     */
    public get WorkspaceProcessor(): TestWorkspaceProcessor<T>
    {
        return this.workspaceProcessor;
    }
}
