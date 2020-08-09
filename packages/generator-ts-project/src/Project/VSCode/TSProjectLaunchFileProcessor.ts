import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { LaunchFileProcessor } from "../../VSCode/LaunchFileProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to process debug-configurations for `TSProject`s.
 */
export class TSProjectLaunchFileProcessor<T extends ITSProjectSettings> extends LaunchFileProcessor<T>
{
    /**
     * Initializes a new instance of the `TSProjectLaunchFileProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
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
        return !debugConfig.name.toLowerCase().includes("yeoman");
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
        }

        return debugConfig;
    }
}
