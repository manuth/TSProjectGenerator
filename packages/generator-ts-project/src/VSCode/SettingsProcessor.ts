import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent.js";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor.js";

/**
 * Provides the functionality to process vscode-settings.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class SettingsProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends VSCodeJSONProcessor<TSettings, TOptions, Record<string, any>>
{
    /**
     * Initializes a new instance of the {@link SettingsProcessor `SettingsProcessor<TSettings, TOptions>`} class.
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
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public override async Process(data: Record<string, any>): Promise<Record<string, any>>
    {
        let result = await super.Process(data);

        for (let key in result)
        {
            if (await this.FilterSetting(key, result[key]))
            {
                result[key] = await this.ProcessSetting(key, result[key]);
            }
            else
            {
                delete result[key];
            }
        }

        return result;
    }

    /**
     * Filters a setting by its key.
     *
     * @param key
     * The key of the setting.
     *
     * @param value
     * The value of the setting to filter.
     *
     * @returns
     * A value indicating whether the setting with the specified key should be included.
     */
    protected async FilterSetting(key: string, value: any): Promise<boolean>
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
