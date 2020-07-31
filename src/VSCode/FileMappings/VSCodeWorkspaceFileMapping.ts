import { IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";

/**
 * Provides a file-mapping for a vscode workspace file.
 */
export abstract class VSCodeWorkspaceFileMapping<T extends IGeneratorSettings> extends FileMappingBase<T>
{
    /**
     * The component of this file-mapping.
     */
    private component: CodeWorkspaceComponent<T>;

    /**
     * Initializes a new instance of the `VSCodeWorkspaceFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent.Generator);
        this.component = codeWorkspaceComponent;
    }

    /**
     * @inheritdoc
     */
    public get Generator(): IGenerator<T>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the component of this file-mapping.
     */
    protected get Component(): CodeWorkspaceComponent<T>
    {
        return this.component;
    }

    /**
     * Gets the name of the folder which contains the settings (such as .vscode, .vscode-insiders or .vscodium).
     */
    protected get SettingsFolderName(): Promise<string>
    {
        return this.component.SettingsFolderName;
    }
}
