import { IGeneratorSettings, IFileMapping } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { join } from "upath";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "./CodeFileMappingCreator";

/**
 * Provides the functionality to create file-mappings for a workspace-folder.
 */
export class WorkspaceFolderCreator<T extends IGeneratorSettings> extends CodeFileMappingCreator<T>
{
    /**
     * Initializes a new instance of the `WorkspaceFolderCreator` class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): Promise<string>
    {
        return (
            async () =>
            {
                return ".vscode";
            })();
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
    public get FileMappings(): Promise<Array<IFileMapping<T>>>
    {
        return (
            async (): Promise<Array<IFileMapping<T>>> =>
            {
                let files: Array<[string, Promise<any>]> = [
                    [this.ExtensionsFileName, this.Component.ExtensionsMetadata],
                    [this.LaunchFileName, this.Component.LaunchMetadata],
                    [this.SettingsFileName, this.Component.SettingsMetadata],
                    [this.TasksFileName, this.Component.TasksMetadata]
                ];

                let result: Array<IFileMapping<T>> = [];

                for (let fileEntry of files)
                {
                    result.push(
                        {
                            Destination: join(await this.SettingsFolderName, fileEntry[0]),
                            Processor: async (fileMapping, generator) =>
                            {
                                generator.fs.write(await fileMapping.Destination, JSON.stringify(await fileEntry[1], null, 4));
                            }
                        });
                }

                return result;
            })();
    }
}
