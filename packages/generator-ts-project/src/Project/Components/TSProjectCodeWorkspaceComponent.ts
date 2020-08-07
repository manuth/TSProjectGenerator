import { IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectExtensionsProcessor } from "../VSCode/TSProjectExtensionsProcessor";
import { TSProjectLaunchFileProcessor } from "../VSCode/TSProjectLaunchFileProcessor";
import { TSProjectSettingsProcessor } from "../VSCode/TSProjectSettingsProcessor";
import { TSProjectTasksProcessor } from "../VSCode/TSProjectTasksProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSProject`s.
 */
export class TSProjectWorkspaceFolder<T extends ITSProjectSettings> extends CodeWorkspaceComponent<T>
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
    protected get ExtensionsProcessor(): JSONProcessor<T, IExtensionFile>
    {
        return new TSProjectExtensionsProcessor(this);
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new TSProjectLaunchFileProcessor(this);
    }

    /**
     * @inheritdoc
     */
    protected get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return new TSProjectSettingsProcessor(this);
    }

    /**
     * @inheritdoc
     */
    protected get TasksProcessor(): JSONProcessor<T, ITaskFile>
    {
        return new TSProjectTasksProcessor(this);
    }
}
