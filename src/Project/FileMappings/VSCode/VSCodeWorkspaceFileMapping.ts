import { CodeWorkspaceComponent } from "../../Components/CodeWorkspaceComponent";
import { ITSProjectSettings } from "../../ITSProjectSettings";
import { ProjectFileMapping } from "../ProjectFileMapping";

/**
 * Provides a file-mapping for a vscode workspace file.
 */
export abstract class VSCodeWorkspaceFileMapping<T extends ITSProjectSettings> extends ProjectFileMapping<T>
{
    /**
     * The workspace-component of this file-mapping.
     */
    private codeWorkspaceComponent: CodeWorkspaceComponent<T>;

    /**
     * Initializes a new instance of the `VSCodeWorkspaceFileMapping` class.
     *
     * @param codeWorkspaceComponent
     * The workspace-component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent?: CodeWorkspaceComponent<T>)
    {
        super();
        this.codeWorkspaceComponent = codeWorkspaceComponent ?? null;
    }

    /**
     * Gets the workspace-component of this file-mapping.
     */
    protected get CodeWorkspaceComponent(): CodeWorkspaceComponent<T>
    {
        return this.codeWorkspaceComponent;
    }

    /**
     * Gets the name of the folder which contains the settings (such as .vscode, .vscode-insiders or .vscodium).
     */
    protected get SettingsFolderName(): string
    {
        return (this.CodeWorkspaceComponent ?? new CodeWorkspaceComponent()).SettingsFolderName;
    }
}
