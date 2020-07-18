import { Component, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleLaunchFileMapping } from "../FileMappings/VSCode/TSModuleLaunchFileMapping";

/**
 * Provides a component for creating a vscode-workspace for `TSModule`s.
 */
export class TSModuleCodeWorkspace<T extends ITSProjectSettings> extends TSProjectCodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSModuleCodeWorkspace<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     *
     * @param settingsFolderName
     * The name of the directory which contains vscode-settings.
     *
     * @param component
     * A resolved representation of this component.
     *
     * @param generator
     * The generator of this component.
     *
     * @returns
     * A file-mapping for creating the `launch.json` file.
     */
    protected async GetLaunchFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new TSModuleLaunchFileMapping(settingsFolderName);
    }
}
