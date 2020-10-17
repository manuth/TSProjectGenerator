import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { normalize } from "upath";
import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { LaunchSettingsProcessor } from "../../VSCode/LaunchSettingsProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to process debug-configurations for `TSProject`s.
 */
export class TSProjectLaunchSettingsProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends LaunchSettingsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectLaunchDataProcessor` class.
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
            normalize(debugConfig.program ?? "").toLowerCase().endsWith("yo/lib/cli.js") ||
            (debugConfig.program ?? "").includes("${workspaceFolder:MyTSProjectGenerator}"));
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

        if (Array.isArray(debugConfig.outFiles))
        {
            debugConfig.outFiles = debugConfig.outFiles.map((pattern) => this.StripWorkspaceFolder(pattern));
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
