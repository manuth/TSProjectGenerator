import { EOL } from "os";
import { GeneratorOptions, IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { split } from "eol";
import { join } from "upath";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "./CodeFileMappingCreator";

/**
 * Provides the functionality to create file-mappings for a workspace-folder.
 */
export class WorkspaceFolderCreator<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeFileMappingCreator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `WorkspaceFolderCreator` class.
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
            [this.ExtensionsFileName, this.Component.ExtensionsMetadata],
            [this.LaunchFileName, this.Component.LaunchMetadata],
            [this.SettingsFileName, this.Component.SettingsMetadata],
            [this.TasksFileName, this.Component.TasksMetadata]
        ];

        let result: Array<IFileMapping<TSettings, TOptions>> = [];

        for (let fileEntry of files)
        {
            result.push(
                {
                    Destination: join(this.SettingsFolderName, fileEntry[0]),
                    Processor: async (fileMapping, generator) =>
                    {
                        generator.fs.write(fileMapping.Destination, split(JSON.stringify(await fileEntry[1], null, 4)).join(EOL));
                    }
                });
        }

        return result;
    }
}
