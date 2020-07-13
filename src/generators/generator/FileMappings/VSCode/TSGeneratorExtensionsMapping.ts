import { ProjectExtensionsMapping } from "../../../../Project/FileMappings/VSCode/ProjectExtensionsMapping";
import { ITSProjectSettings } from "../../../../Project/ITSProjectSettings";

/**
 * Provides a file-mapping for copying the `extensions.json` file for `TSGenerator`s.
 */
export class TSGeneratorExtensionsMapping<T extends ITSProjectSettings> extends ProjectExtensionsMapping<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorExtensionsMapping<T>` class.
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
        return recommendations;
    }
}
