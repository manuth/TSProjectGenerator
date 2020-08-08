import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { CodeWorkspaceProvider } from "./CodeWorkspaceProvider";

/**
 * Provides the functionality to load workspace-settings from a `.code-workspace` file.
 */
export class WorkspaceFileLoader<T extends IGeneratorSettings> extends CodeWorkspaceProvider<T>
{
    /**
     * The name of the workspace file.
     */
    private workspaceFileName: string;

    /**
     * Initializes a new instance of the `WorkspaceFolderLoader` class.
     *
     * @param component
     * The component of the file-mapping creator.
     *
     * @param workspaceFileName
     * The name of the workspace file.
     */
    public constructor(component: CodeWorkspaceComponent<T>, workspaceFileName: string)
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
     */
    public get WorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return (
            async (): Promise<IWorkspaceMetadata> =>
            {
                return this.ReadJSON(this.WorkspaceFileName);
            })();
    }
}
