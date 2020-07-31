import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../IExtensionFile";
import { VSCodeJSONFileMapping } from "./VSCodeJSONFileMapping";

/**
 * Provides a file-mapping for copying an `extensions.json` file.
 */
export class VSCodeExtensionsMapping<T extends IGeneratorSettings> extends VSCodeJSONFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeExtensionsMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(await this.SettingsFolderName, "extensions.json");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return join(await this.SettingsFolderName, "extensions.json");
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<IExtensionFile>
    {
        return (
            async () =>
            {
                let result: IExtensionFile = JSON.parse((await readFile(await this.Resolved.Source)).toString());
                result.recommendations = await this.FilterRecommendations(result.recommendations ?? []);
                return result;
            })();
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
