import { GeneratorOptions, IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";
import upath from "upath";
import { JSONCCreatorMapping } from "../../Components/JSONCCreatorMapping.js";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent.js";
import { CodeFileMappingCreator } from "./CodeFileMappingCreator.js";

const { join } = upath;

/**
 * Provides the functionality to create file-mappings for a workspace-folder.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class WorkspaceFolderCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeFileMappingCreator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link WorkspaceFolderCreator `WorkspaceFolderCreator<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): string
    {
        return ".vscode";
    }

    /**
     * Gets the name of the extensions-file.
     */
    public get ExtensionsFileName(): string
    {
        return "extensions.json";
    }

    /**
     * Gets the name of the debug settings file.
     */
    public get LaunchFileName(): string
    {
        return "launch.json";
    }

    /**
     * Gets the name of the settings-file.
     */
    public get SettingsFileName(): string
    {
        return "settings.json";
    }

    /**
     * Gets the name of the tasks-file.
     */
    public get TasksFileName(): string
    {
        return "tasks.json";
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        let files: Array<[string, Promise<any>]> = [
            [this.ExtensionsFileName, this.Component.GetExtensionsMetadata()],
            [this.LaunchFileName, this.Component.GetLaunchMetadata()],
            [this.SettingsFileName, this.Component.GetSettingsMetadata()],
            [this.TasksFileName, this.Component.GetTasksMetadata()]
        ];

        return files.map(
            (fileEntry): IFileMapping<TSettings, TOptions> =>
            {
                return {
                    Destination: join(this.SettingsFolderName, fileEntry[0]),
                    Processor: async (target) =>
                    {
                        return new JSONCCreatorMapping(this.Generator, target.Destination, await fileEntry[1]).Processor();
                    }
                };
            });
    }
}
