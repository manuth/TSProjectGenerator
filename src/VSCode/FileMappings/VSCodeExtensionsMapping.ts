import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { ITSProjectSettings } from "../../Project/ITSProjectSettings";
import { IExtensionFile } from "../IExtensionFile";
import { VSCodeWorkspaceFileMapping } from "./VSCodeWorkspaceFileMapping";

/**
 * Provides a file-mapping for copying an `extensions.json` file.
 */
export class VSCodeExtensionsMapping<T extends ITSProjectSettings> extends VSCodeWorkspaceFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeExtensionsMapping` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
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
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return generator.modulePath(this.SettingsFolderName, "extensions.json");
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
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return join(this.SettingsFolderName, "extensions.json");
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
    protected async GetMetadata(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<IExtensionFile>
    {
        let result: IExtensionFile = JSON.parse((await readFile(await fileMapping.Source)).toString());
        result.recommendations = await this.FilterRecommendations(result.recommendations ?? []);
        return result;
    }

    /**
     * Filters out useless recommendations.
     *
     * @param recommendations
     * The recommendations to filter.
     *
     * @returns
     * All necessary recommendations.
     */
    protected async FilterRecommendations(recommendations: string[]): Promise<string[]>
    {
        return recommendations;
    }
}
