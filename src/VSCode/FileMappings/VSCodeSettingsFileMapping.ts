import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { VSCodeJSONFileMapping } from "./VSCodeJSONFileMapping";

/**
 * Provides a file-mapping for copying the `launch.json` file.
 */
export class VSCodeSettingsFileMapping<T extends IGeneratorSettings> extends VSCodeJSONFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeSettingsFileMapping<T>` class.
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
                return this.Generator.modulePath(await this.SettingsFolderName, "settings.json");
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
                return join(await this.SettingsFolderName, "settings.json");
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<Record<string, any>>
    {
        return (
            async () =>
            {
                let settings: Record<string, any> = JSON.parse((await readFile(await this.Resolved.Source)).toString());

                for (let key in settings)
                {
                    if (await this.FilterSettingKey(key))
                    {
                        settings[key] = await this.ProcessSetting(key, settings[key]);
                    }
                    else
                    {
                        delete settings[key];
                    }
                }

                return settings;
            })();
    }

    /**
     * Filters a setting by its key.
     *
     * @param key
     * The key of the setting
     *
     * @returns
     * A value indicating whether the setting with the specified key should be included.
     */
    protected async FilterSettingKey(key: string): Promise<boolean>
    {
        return true;
    }

    /**
     * Processes a setting.
     *
     * @param key
     * The key of the setting to process
     *
     * @param value
     * The value of the setting to process.
     *
     * @returns
     * The processed setting.
     */
    protected async ProcessSetting(key: string, value: any): Promise<any>
    {
        return value;
    }
}
