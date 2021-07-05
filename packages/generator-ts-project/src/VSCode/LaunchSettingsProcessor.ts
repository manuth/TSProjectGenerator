import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "./ILaunchSettings";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode debug configurations.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class LaunchSettingsProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends VSCodeJSONProcessor<TSettings, TOptions, ILaunchSettings>
{
    /**
     * Initializes a new instance of the {@link LaunchSettingsProcessor `LaunchSettingsProcessor<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param launchSettings
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public override async Process(launchSettings: ILaunchSettings): Promise<ILaunchSettings>
    {
        let result = await super.Process(launchSettings);

        if (result?.configurations)
        {
            for (let i = result.configurations.length - 1; i >= 0; i--)
            {
                if (await this.FilterDebugConfig(result.configurations[i]))
                {
                    result.configurations[i] = await this.ProcessDebugConfig(result.configurations[i]);
                }
                else
                {
                    result.configurations.splice(i, 1);
                }
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
