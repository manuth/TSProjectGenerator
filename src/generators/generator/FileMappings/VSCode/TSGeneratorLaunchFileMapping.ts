import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { DebugConfiguration } from "vscode";
import { TSProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";
import { ISubGenerator } from "../../Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../../Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../Settings/TSGeneratorSettingKey";

/**
 * Provides a file-mapping for copying the `launch.json` file for a `TSGenerator`.
 */
export class TSGeneratorLaunchFileMapping<T extends ITSGeneratorSettings> extends TSProjectLaunchFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorLaunchFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * Gets a template-configuration for yeoman-tasks.
     */
    protected get TemplateMetadata(): Promise<DebugConfiguration>
    {
        return (
            async () =>
            {
                let launchConfig: ILaunchFile = JSON.parse((await readFile(await this.Source)).toString());

                return launchConfig.configurations.find(
                    (debugConfig) =>
                    {
                        return debugConfig.name.toLowerCase().includes("yeoman");
                    });
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<ILaunchFile>
    {
        let metadata = super.Metadata;

        return (
            async () =>
            {
                let result = await metadata;
                let configurations: DebugConfiguration[] = [];

                let generators: ISubGenerator[] = [
                    {
                        [SubGeneratorSettingKey.DisplayName]: this.Generator.Settings[TSProjectSettingKey.DisplayName],
                        [SubGeneratorSettingKey.Name]: "app"
                    }
                ];

                if (this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
                {
                    for (let subGeneratorOptions of this.Generator.Settings[TSGeneratorSettingKey.SubGenerators] ?? [])
                    {
                        generators.push(subGeneratorOptions);
                    }
                }

                for (let generator of generators)
                {
                    let template = await this.TemplateMetadata;
                    let displayName = generator[SubGeneratorSettingKey.DisplayName];
                    let name = generator[SubGeneratorSettingKey.Name];
                    template.name = name === "app" ? "Launch Yeoman" : `Launch ${displayName} generator`;

                    template.args = [
                        `\${workspaceFolder}/lib/generators/${name}`
                    ];

                    configurations.push(template);
                }

                result.configurations.unshift(...configurations);
                return result;
            })();
    }
}
