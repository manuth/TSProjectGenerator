import { CodeWorkspaceComponent } from "../../Components/CodeWorkspaceComponent";
import { ITSProjectSettings } from "../../ITSProjectSettings";
import { VSCodeExtensionsMapping } from "./VSCodeExtensionsMapping";

/**
 * Provides a file-mapping for copying the `extensions.json` file.
 */
export class ProjectExtensionsMapping<T extends ITSProjectSettings> extends VSCodeExtensionsMapping<T>
{
    /**
     * Initializes a new instance of the `ProjectExtensionsMapping` class.
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
     * @param recommendations
     * The recommendations to filter.
     *
     * @returns
     * All necessary recommendations.
     */
    protected async FilterRecommendations(recommendations: string[]): Promise<string[]>
    {
        return recommendations.filter(
            (extension) =>
            {
                return extension !== "qdigitalbrainstem.javascript-ejs-support";
            });
    }
}
