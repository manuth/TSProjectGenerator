import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { DebugConfiguration } from "vscode";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { VSCodeJSONFileMapping } from "./VSCodeJSONFileMapping";

/**
 * Provides a file-mapping for copying the `launch.json` file.
 */
export class VSCodeLaunchFileMapping<T extends ITSProjectSettings> extends VSCodeJSONFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeLaunchFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return generator.modulePath(this.SettingsFolderName, "launch.json");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return join(this.SettingsFolderName, "launch.json");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The metadata to write into the file.
     */
    protected async GetMetadata(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<ILaunchFile>
    {
        let result: ILaunchFile = JSON.parse((await readFile(await fileMapping.Source)).toString());
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
