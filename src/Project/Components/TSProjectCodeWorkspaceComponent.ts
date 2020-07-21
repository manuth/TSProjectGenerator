import { IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { TSProjectExtensionsMapping } from "../FileMappings/VSCode/TSProjectExtensionsMapping";
import { TSProjectLaunchFileMapping } from "../FileMappings/VSCode/TSProjectLaunchFileMapping";
import { TSProjectSettingsFileMapping } from "../FileMappings/VSCode/TSProjectSettingsFileMapping";
import { TSProjectTasksFileMapping } from "../FileMappings/VSCode/TSProjectTasksFileMapping";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides a component for creating a vscode-workspace for `TSProject`s.
 */
export class TSProjectCodeWorkspaceComponent<T extends ITSProjectSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSProjectCodeWorkspaceComponent<T>` class.
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
    protected get ExtensionsFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSProjectExtensionsMapping(this);
            })();
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSProjectLaunchFileMapping(this);
            })();
    }

    /**
     * @inheritdoc
     */
    protected get SettingsFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSProjectSettingsFileMapping(this);
            })();
    }

    /**
     * @inheritdoc
     */
    protected get TaskFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSProjectTasksFileMapping(this);
            })();
    }
}
