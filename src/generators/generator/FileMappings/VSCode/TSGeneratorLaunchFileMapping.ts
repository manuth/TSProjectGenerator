import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { DebugConfiguration } from "vscode";
import { TSProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";
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

                let generatorNames = [
                    "app"
                ];

                if (this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
                {
                    for (let subGeneratorOptions of this.Generator.Settings[TSGeneratorSettingKey.SubGenerator] ?? [])
                    {
                        generatorNames.push(subGeneratorOptions[SubGeneratorSettingKey.Name]);
                    }
                }

                for (let generatorName of generatorNames)
                {
                    let template = await this.TemplateMetadata;
                    template.name = generatorName === "app" ? "Launch Yeoman" : `Launch ${generatorName} generator`;

                    template.args = [
                        `\${workspaceFolder}/lib/generators/${generatorName}`
                    ];

                    configurations.push(template);
                }

                result.configurations.unshift(...configurations);
                return result;
            })();
    }
}
