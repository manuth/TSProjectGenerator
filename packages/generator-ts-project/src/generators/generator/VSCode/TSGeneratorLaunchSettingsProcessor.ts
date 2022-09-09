import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import upath from "upath";
import { DebugConfiguration } from "vscode";
import { GeneratorName } from "../../../Core/GeneratorName.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectLaunchSettingsProcessor } from "../../../Project/VSCode/TSProjectLaunchSettingsProcessor.js";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent.js";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings.js";
import { ISubGenerator } from "../Settings/ISubGenerator.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../Settings/SubGeneratorSettingKey.js";
import { TSGeneratorComponent } from "../Settings/TSGeneratorComponent.js";
import { TSGeneratorSettingKey } from "../Settings/TSGeneratorSettingKey.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";

const { join, normalize } = upath;

/**
 * Provides the functionality to process vscode debug configurations for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorLaunchSettingsProcessor<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectLaunchSettingsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorLaunchSettingsProcessor `TSGeneratorLaunchSettingsProcessor<TSettings, TOptions>`} class.
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
    public override async Process(data: ILaunchSettings): Promise<ILaunchSettings>
    {
        let result = await super.Process(data);
        let configurations: DebugConfiguration[] = [];

        let generators: ISubGenerator[] = [
            {
                [SubGeneratorSettingKey.DisplayName]: this.Generator.Settings[TSProjectSettingKey.DisplayName],
                [SubGeneratorSettingKey.Name]: GeneratorName.Main
            }
        ];

        if (this.Generator.Settings[GeneratorSettingKey.Components]?.includes(TSGeneratorComponent.SubGeneratorExample))
        {
            for (let subGeneratorOptions of this.Generator.Settings[TSGeneratorSettingKey.SubGenerators] ?? [])
            {
                generators.push(subGeneratorOptions);
            }
        }

        for (let generatorOptions of generators)
        {
            let template = await this.GetYeomanTemplate();
            let displayName = generatorOptions[SubGeneratorSettingKey.DisplayName];
            let name = generatorOptions[SubGeneratorSettingKey.Name];
            template.name = name === GeneratorName.Main ? "Launch Yeoman" : `Launch ${displayName} generator`;

            template.args = [
                join(this.GetWorkspaceFolderDirective(), "lib", "generators", name)
            ];

            configurations.push(template);
        }

        result.configurations.unshift(...configurations);
        return result;
    }

    /**
     * Gets a template-configuration for yeoman-tasks.
     *
     * @returns
     * A template-configuration for yeoman-tasks.
     */
    protected async GetYeomanTemplate(): Promise<DebugConfiguration>
    {
        return (
            async () =>
            {
                return this.ProcessDebugConfig((await this.Component.Source.GetLaunchMetadata()).configurations.find(
                    (debugConfig) =>
                    {
                        return normalize(debugConfig.program ?? "").toLowerCase().endsWith(
                            join("node_modules", "yo", "lib", "cli.js"));
                    }));
            })();
    }
}
