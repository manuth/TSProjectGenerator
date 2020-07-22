import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { DebugConfiguration } from "vscode";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { VSCodeJSONFileMapping } from "./VSCodeJSONFileMapping";

/**
 * Provides a file-mapping for copying the `launch.json` file.
 */
export class VSCodeLaunchFileMapping<T extends ITSProjectSettings> extends VSCodeJSONFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeLaunchFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(await this.SettingsFolderName, "launch.json");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return join(await this.SettingsFolderName, "launch.json");
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<ILaunchFile>
    {
        return (
            async () =>
            {
                let result: ILaunchFile = JSON.parse((await readFile(await this.Resolved.Source)).toString());
                result.configurations = result.configurations ?? [];

                for (let i = 0; i < result.configurations.length; i++)
                {
                    if (await this.FilterDebugConfig(result.configurations[i]))
                    {
                        await this.ProcessDebugConfig(result.configurations[i]);
                    }
                    else
                    {
                        result.configurations.splice(i, 1);
                    }
                }

                return result;
            })();
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
