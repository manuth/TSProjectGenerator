import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import fs from "fs-extra";
import { IParser } from "../../Components/Transformation/Conversion/IParser.js";
import { JSONCConverter } from "../../Components/Transformation/Conversion/JSONCConverter.js";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent.js";
import { IExtensionSettings } from "../IExtensionSettings.js";
import { ILaunchSettings } from "../ILaunchSettings.js";
import { ITaskSettings } from "../ITaskSettings.js";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata.js";

const { readFile } = fs;

/**
 * Provides the functionality to load a vscode-workspace.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class CodeWorkspaceProvider<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link CodeWorkspaceProvider `CodeWorkspaceProvider<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of this code-workspace provider.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        this.component = component;
    }

    /**
     * Gets the component of this code-workspace provider.
     */
    public get Component(): CodeWorkspaceComponent<TSettings, TOptions>
    {
        return this.component;
    }

    /**
     * Gets the generator of this code-workspace provider.
     */
    public get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the meta-data of the workspace.
     *
     * @returns
     * The meta-data of the workspace.
     */
    public abstract GetWorkspaceMetadata(): Promise<IWorkspaceMetadata>;

    /**
     * Gets the meta-data of the extensions.
     *
     * @returns
     * The meta-data of the extensions.
     */
    public async GetExtensionsMetadata(): Promise<IExtensionSettings>
    {
        return (await this.GetWorkspaceMetadata()).extensions;
    }

    /**
     * Gets the meta-data of the debug-settings.
     *
     * @returns
     * The meta-data of the debug-settings.
     */
    public async GetLaunchMetadata(): Promise<ILaunchSettings>
    {
        return (await this.GetWorkspaceMetadata()).launch;
    }

    /**
     * Gets the meta-data of the settings.
     *
     * @returns
     * The meta-data of the settings.
     */
    public async GetSettingsMetadata(): Promise<Record<string, any>>
    {
        return (await this.GetWorkspaceMetadata()).settings;
    }

    /**
     * Gets the meta-data of the tasks.
     *
     * @returns
     * The meta-data of the tasks.
     */
    public async GetTasksMetadata(): Promise<ITaskSettings>
    {
        return (await this.GetWorkspaceMetadata()).tasks;
    }

    /**
     * Gets a component for dumping json-code.
     */
    protected get Parser(): IParser<any>
    {
        return new JSONCConverter();
    }

    /**
     * Reads json from the specified {@link path `path`}.
     *
     * @param path
     * The path to the JSON file to read.
     *
     * @returns
     * The JSON read from the specified {@link path `path`}.
     */
    protected async ReadJSON(path: string): Promise<any>
    {
        return this.Parser.Parse((await readFile(path)).toString());
    }
}
