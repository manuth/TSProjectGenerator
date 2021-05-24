import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { join, normalize } from "upath";
import { DebugConfiguration } from "vscode";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectLaunchSettingsProcessor } from "../../../Project/VSCode/TSProjectLaunchSettingsProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ISubGenerator } from "../Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../Settings/TSGeneratorSettingKey";

/**
 * Provides the functionality to process vscode debug configurations for `TSGenerator`s.
 */
export class TSGeneratorLaunchSettingsProcessor<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectLaunchSettingsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorLaunchSettingsProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * Gets a template-configuration for yeoman-tasks.
     */
    protected get TemplateMetadata(): Promise<DebugConfiguration>
    {
        return (
            async () =>
            {
                return this.ProcessDebugConfig((await this.Component.Source.LaunchMetadata).configurations.find(
                    (debugConfig) =>
                    {
                        return normalize(debugConfig.program ?? "").toLowerCase().endsWith(
                            join("node_modules", "yo", "lib", "cli.js"));
                    }));
            })();
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
    public async Process(data: ILaunchSettings): Promise<ILaunchSettings>
    {
        let result = await super.Process(data);
        let configurations: DebugConfiguration[] = [];

        let generators: ISubGenerator[] = [
            {
                [SubGeneratorSettingKey.DisplayName]: this.Generator.Settings[TSProjectSettingKey.DisplayName],
                [SubGeneratorSettingKey.Name]: "app"
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
            let template = await this.TemplateMetadata;
            let displayName = generatorOptions[SubGeneratorSettingKey.DisplayName];
            let name = generatorOptions[SubGeneratorSettingKey.Name];
            template.name = name === "app" ? "Launch Yeoman" : `Launch ${displayName} generator`;

            template.args = [
                `\${workspaceFolder}/lib/generators/${name}`
            ];

            configurations.push(template);
        }

        result.configurations.unshift(...configurations);
        return result;
    }
}
