import { FileMapping, IGenerator, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { DebugConfiguration } from "vscode";
import { ProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/ProjectLaunchFileMapping";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "../../Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../Settings/TSGeneratorSettingKey";

/**
 * Provides a file-mapping for copying the `launch.json` file for a `TSGenerator`.
 */
export class TSGeneratorLaunchFileMapping<T extends ITSGeneratorSettings> extends ProjectLaunchFileMapping<T>
{
    /**
     * Initializes a new instance of the `GeneratorLaunchFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * Gets a template-configuration for yeoman-tasks.
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * A template-configuration for yeoman-tasks.
     */
    protected async GetTemplateMetadata(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<DebugConfiguration>
    {
        let launchConfig: ILaunchFile = JSON.parse((await readFile(await fileMapping.Source)).toString());

        return launchConfig.configurations.find(
            (debugConfig) =>
            {
                return debugConfig.name.toLowerCase().includes("yeoman");
            });
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
        let result = await super.GetMetadata(fileMapping, generator);
        let configurations: DebugConfiguration[] = [];

        let generatorNames = [
            "app"
        ];

        if (generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
        {
            for (let subGeneratorOptions of generator.Settings[TSGeneratorSettingKey.SubGenerator] ?? [])
            {
                generatorNames.push(subGeneratorOptions[SubGeneratorSettingKey.Name]);
            }
        }

        for (let generatorName of generatorNames)
        {
            let template = await this.GetTemplateMetadata(fileMapping, generator);
            template.name = generatorName === "app" ? "Launch Yeoman" : `Launch ${generatorName} generator`;

            template.args = [
                `\${workspaceFolder}/lib/generators/${generatorName}`
            ];

            configurations.push(template);
        }

        result.configurations.unshift(...configurations);
        return result;
    }
}
