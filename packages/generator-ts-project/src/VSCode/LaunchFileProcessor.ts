import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { ILaunchFile } from "./ILaunchFile";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode debug configurations.
 */
export class LaunchFileProcessor<T extends IGeneratorSettings> extends VSCodeJSONProcessor<T, ILaunchFile>
{
    /**
     * Initializes a new instance of the `LaunchFileProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: ILaunchFile): Promise<ILaunchFile>
    {
        let result = await super.Process(data);
        result.configurations = result.configurations ?? [];

        for (let i = result.configurations.length - 1; i >= 0; i--)
        {
            if (await this.FilterDebugConfig(result.configurations[i]))
            {
                result.configurations[i] = await this.ProcessDebugConfig(result.configurations[i]);
            }
            else
            {
                data.configurations.splice(i, 1);
            }
        }

        return result;
    }

    /**
     * Determines whether a debug-configuration should be included.
     *
     * @param debugConfig
     * The debug-configuration to filter.
     *
     * @returns
     * A value indicating whether the debug-configuration should be included.
     */
    protected async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
    {
        return true;
    }

    /**
     * Processes a debug-configuration.
     *
     * @param debugConfig
     * The debug-configuration to process.
     *
     * @returns
     * The processed debug-configuration.
     */
    protected async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
    {
        return debugConfig;
    }
}
