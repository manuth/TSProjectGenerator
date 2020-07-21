import { IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { VSCodeExtensionsMapping } from "../FileMappings/VSCodeExtensionsMapping";
import { VSCodeLaunchFileMapping } from "../FileMappings/VSCodeLaunchFileMapping";
import { VSCodeSettingsFileMapping } from "../FileMappings/VSCodeSettingsFileMapping";
import { VSCodeTasksFileMapping } from "../FileMappings/VSCodeTasksFileMapping";

/**
 * Provides a component for creating a vscode-workspace.
 */
export class CodeWorkspaceComponent<T extends ITSProjectSettings> extends ComponentBase<T>
{
    /**
     * Initializes a new instance of the `CodeWorkspaceComponent<T>` class.
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
    public get ID(): string
    {
        return TSProjectComponent.VSCode;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "Visual Studio Code Workspace";
    }

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Promise<Array<IFileMapping<T>>>
    {
        return (
            async () =>
            {
                let settingsFolderName = await this.SettingsFolderName;

                return [
                    {
                        Source: this.Generator.modulePath(settingsFolderName),
                        Destination: settingsFolderName
                    },
                    await this.ExtensionsFileMapping,
                    await this.LaunchFileMapping,
                    await this.SettingsFileMapping,
                    await this.TaskFileMapping
                ];
            })();
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): Promise<string>
    {
        return (
            async () =>
            {
                return ".vscode";
            })();
    }

    /**
     * Gets a file-mapping for creating the `extensions.js` file.
     */
    protected get ExtensionsFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new VSCodeExtensionsMapping(this);
            })();
    }

    /**
     * Gets a file-mapping for creating the `launch.json` file.
     */
    protected get LaunchFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new VSCodeLaunchFileMapping(this);
            })();
    }

    /**
     * Gets a file-mapping for creating the `settings.json` file.
     */
    protected get SettingsFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new VSCodeSettingsFileMapping(this);
            })();
    }

    /**
     * Gets a file-mapping for creating the `tasks.json` file.
     */
    protected get TaskFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new VSCodeTasksFileMapping(this);
            })();
    }
}
