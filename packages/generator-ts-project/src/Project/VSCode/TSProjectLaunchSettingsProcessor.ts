import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { join, normalize } from "upath";
import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { LaunchSettingsProcessor } from "../../VSCode/LaunchSettingsProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";

/**
 * Provides the functionality to process debug-configurations for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectLaunchSettingsProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends LaunchSettingsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectLaunchSettingsProcessor `TSProjectLaunchSettingsProcessor<TSettings, TOptions>`} class.
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
    public override Process(debugSettings: ILaunchSettings): Promise<ILaunchSettings>
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
    protected override async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
    {
        return (debugConfig.program ?? "").includes(this.GetWorkspaceFolderDirective("TSProjectGenerator")) &&
            !(normalize(debugConfig.program ?? "").toLowerCase().endsWith(join("node_modules", "yo", "lib", "cli.js")));
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
    protected override async ProcessDebugConfig(debugConfig: DebugConfiguration): Promise<DebugConfiguration>
    {
        let workspaceDirective = this.GetWorkspaceFolderDirective();
        let destinationSetting = "outFiles";
        debugConfig.name = debugConfig.name.replace(/(?<!\s)\s+TSProjectGenerator\s+/, " ");
        delete debugConfig.presentation;
        delete debugConfig.autoAttachChildProcesses;
        delete debugConfig.skipFiles;

        if (typeof debugConfig.program === "string")
        {
            debugConfig.program = this.StripWorkspaceFolder(debugConfig.program);
        }

        if (Array.isArray(debugConfig.args))
        {
            debugConfig.args = debugConfig.args.map((arg) => this.StripWorkspaceFolder(arg));
        }

        if (Array.isArray(debugConfig[destinationSetting]))
        {
            let outFiles = debugConfig[destinationSetting];

            debugConfig[destinationSetting] = [
                ...new Set((outFiles as string[]).map((pattern) => this.StripWorkspaceFolder(pattern)))
            ];
        }

        if (typeof debugConfig.cwd === "string")
        {
            debugConfig.cwd = this.StripWorkspaceFolder(debugConfig.cwd);

            if (debugConfig.cwd === workspaceDirective)
            {
                delete debugConfig.cwd;
            }
        }

        return debugConfig;
    }
}
