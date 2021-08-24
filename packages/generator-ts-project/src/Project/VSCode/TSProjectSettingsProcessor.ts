import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { SettingsProcessor } from "../../VSCode/SettingsProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";

/**
 * Provides the functionality to process settings for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectSettingsProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends SettingsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectSettingsProcessor `TSProjectSettingsProcessor<TSettings, TOptions>`} class.
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
     * @param key
     * The key of the setting.
     *
     * @param value
     * The value of the setting to filter.
     *
     * @returns
     * A value indicating whether the setting with the specified key should be included.
     */
    protected override async FilterSetting(key: string, value: any): Promise<boolean>
    {
        return ![
            "files.associations",
            "mochaExplorer.debuggerConfig",
            "search.exclude",
            "typescript.tsdk",
            "terminal.integrated.cwd"
        ].includes(key);
    }
}
