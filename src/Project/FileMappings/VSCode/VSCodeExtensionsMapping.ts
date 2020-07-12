import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { CodeWorkspaceComponent } from "../../Components/CodeWorkspaceComponent";
import { ITSProjectSettings } from "../../ITSProjectSettings";
import { VSCodeWorkspaceFileMapping } from "./VSCodeWorkspaceFileMapping";

/**
 * Provides a file-mapping for copying an `extensions.json` file.
 */
export class VSCodeExtensionsMapping<T extends ITSProjectSettings> extends VSCodeWorkspaceFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeExtensionsMapping` class.
     *
     * @param codeWorkspaceComponent
     * The workspace-component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent?: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
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
     * Processes the file.
     *
     * @param fileMapping
     * The file-mapping to process.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        let result: IExtensionFile = JSON.parse((await readFile(await fileMapping.Source)).toString());
        result.recommendations = await this.FilterRecommendations(result.recommendations ?? []);
        generator.fs.write(await fileMapping.Destination, JSON.stringify(result, null, 4));
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
