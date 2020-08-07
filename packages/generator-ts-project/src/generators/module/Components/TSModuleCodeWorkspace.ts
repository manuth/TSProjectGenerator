import { IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { TSModuleLaunchFileProcessor } from "../VSCode/TSModuleLaunchFileProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSModule`s.
 */
export class TSModuleCodeWorkspace<T extends ITSProjectSettings> extends TSProjectWorkspaceFolder<T>
{
    /**
     * Initializes a new isntance of the `TSModuleWorkspaceFolder<T>` class.
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
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new TSModuleLaunchFileProcessor(this);
    }
}
