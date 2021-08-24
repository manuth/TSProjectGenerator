import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { CodeWorkspaceProvider } from "./CodeWorkspaceProvider";

/**
 * Provides the functionality to load workspace-settings from a `.code-workspace` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class WorkspaceFileLoader<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceProvider<TSettings, TOptions>
{
    /**
     * The name of the workspace file.
     */
    private workspaceFileName: string;

    /**
     * Initializes a new instance of the {@link WorkspaceFileLoader `WorkspaceFileLoader<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the file-mapping creator.
     *
     * @param workspaceFileName
     * The name of the workspace file.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>, workspaceFileName: string)
    {
        super(component);
        this.workspaceFileName = workspaceFileName;
    }

    /**
     * Gets the name of the workspace file.
     */
    public get WorkspaceFileName(): string
    {
        return this.workspaceFileName;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the workspace.
     */
    public async GetWorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return this.ReadJSON(this.WorkspaceFileName);
    }
}
