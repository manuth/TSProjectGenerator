import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { LaunchFileProcessor } from "../../VSCode/LaunchFileProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to process debug-configurations for `TSProject`s.
 */
export class TSProjectLaunchFileProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends LaunchFileProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectLaunchFileProcessor` class.
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
     * @param debugSettings
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public Process(debugSettings: ILaunchSettings): Promise<ILaunchSettings>
    {
        delete (debugSettings as any).compounds;
        return super.Process(debugSettings);
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
        return !(
            debugConfig.name.toLowerCase().includes("yeoman") ||
            debugConfig.name.toLowerCase().includes("mytsproject"));
    }

    /**
     * @inheritdoc
     *
     * @param debugConfig
     * The debug-configuration to process.
     *
     * @returns
     * The processed debug-configuration.
     */
    protected async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
    {
        debugConfig.name = debugConfig.name.replace(/\s*TSProjectGenerator\s*/, " ");
        delete debugConfig.presentation;
        delete debugConfig.autoAttachChildProcesses;

        if (typeof debugConfig.program === "string")
        {
            debugConfig.program = this.StripWorkspaceFolder(debugConfig.program);
        }

        if (Array.isArray(debugConfig.args))
        {
            debugConfig.args = debugConfig.args.map((arg) => this.StripWorkspaceFolder(arg));
        }

        if (typeof debugConfig.cwd === "string")
        {
            debugConfig.cwd = this.StripWorkspaceFolder(debugConfig.cwd);

            if (debugConfig.cwd === "${workspaceFolder}")
            {
                delete debugConfig.cwd;
            }
        }

        return debugConfig;
    }
}
