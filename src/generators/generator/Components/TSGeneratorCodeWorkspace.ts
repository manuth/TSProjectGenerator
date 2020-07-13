import { Component, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSGeneratorExtensionsMapping } from "../FileMappings/VSCode/TSGeneratorExtensionsMapping";
import { TSGeneratorLaunchFileMapping } from "../FileMappings/VSCode/TSGeneratorLaunchFileMapping";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";

/**
 * Provides a component for creating a vscode-workspace for `TSGenerator`s.
 */
export class TSGeneratorCodeWorkspace<T extends ITSGeneratorSettings> extends TSProjectCodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSGeneratorCodeWorkspace<T>` class.
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
     * A file-mapping for creating the `extensions.js` file.
     */
    protected async GetExtensionsFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new TSGeneratorExtensionsMapping(settingsFolderName);
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
        return new TSGeneratorLaunchFileMapping(settingsFolderName);
    }
}
