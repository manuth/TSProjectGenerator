import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { DebugConfiguration } from "vscode";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSProjectLaunchFileProcessor } from "../../../Project/VSCode/TSProjectLaunchFileProcessor";
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
export class TSGeneratorLaunchFileProcessor<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectLaunchFileProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorLaunchFileProcessor` class.
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
                        return debugConfig.name.toLowerCase().includes("yeoman");
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
