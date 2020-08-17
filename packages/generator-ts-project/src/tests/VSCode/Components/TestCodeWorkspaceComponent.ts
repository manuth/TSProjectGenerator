import { GeneratorOptions, IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "../../../VSCode/FileMappings/CodeFileMappingCreator";
import { CodeWorkspaceProvider } from "../../../VSCode/FileMappings/CodeWorkspaceProvider";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TestCodeWorkspaceProvider } from "../FileMappings/TestCodeWorkspaceProvider";
import { TestWorkspaceProcessor } from "./TestWorkspaceProcessor";

/**
 * Provides an implementation of the `CodeWorkspaceComponent` class for testing.
 */
export class TestCodeWorkspaceComponent<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceComponent<TSettings, TOptions>
{
    /**
     * A component for loading vscode-workspaces.
     */
    private source: CodeWorkspaceProvider<TSettings, TOptions> = new TestCodeWorkspaceProvider(this);

    /**
     * A component for creating file-mappings.
     */
    private fileMappingCreator: CodeFileMappingCreator<TSettings, TOptions> = new WorkspaceFolderCreator(this);

    /**
     * A component for processing workspaces.
     */
    private workspaceProcessor: JSONProcessor<TSettings, TOptions, IWorkspaceMetadata> = new TestWorkspaceProcessor(this);

    /**
     * Initializes a new instance of the `TestCodeWorkspaceComponent` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets or sets a component for loading vscode-workspaces.
     */
    public get Source(): CodeWorkspaceProvider<TSettings, TOptions>
    {
        return this.source;
    }

    /**
     * @inheritdoc
     */
    public set Source(value: CodeWorkspaceProvider<TSettings, TOptions>)
    {
        this.source = value;
    }

    /**
     * Gets or sets a component for creating file-mappings.
     */
    public get FileMappingCreator(): CodeFileMappingCreator<TSettings, TOptions>
    {
        return this.fileMappingCreator;
    }

    /**
     * @inheritdoc
     */
    public set FileMappingCreator(value: CodeFileMappingCreator<TSettings, TOptions>)
    {
        this.fileMappingCreator = value;
    }

    /**
     * Gets or sets a component for processing workspaces.
     */
    public get WorkspaceProcessor(): JSONProcessor<TSettings, TOptions, IWorkspaceMetadata>
    {
        return this.workspaceProcessor;
    }

    /**
     * @inheritdoc
     */
    public set WorkspaceProcessor(value: JSONProcessor<TSettings, TOptions, IWorkspaceMetadata>)
    {
        this.workspaceProcessor = value;
    }
}
