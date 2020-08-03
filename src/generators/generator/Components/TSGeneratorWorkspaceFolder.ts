import { IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ExtensionsProcessor } from "../../../VSCode/ExtensionsProcessor";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorLaunchFileProcessor } from "../VSCode/TSGeneratorLaunchFileProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSGenerator`s.
 */
export class TSGeneratorWorkspaceFolder<T extends ITSGeneratorSettings> extends TSProjectWorkspaceFolder<T>
{
    /**
     * Initializes a new isntance of the `TSGeneratorWorkspaceFolder<T>` class.
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
        return new ExtensionsProcessor(this);
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new TSGeneratorLaunchFileProcessor(this);
    }
}
