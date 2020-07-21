import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { VSCodeExtensionsMapping } from "../../../VSCode/FileMappings/VSCodeExtensionsMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";

/**
 * Provides a file-mapping for copying the `extensions.json` file.
 */
export class TSProjectExtensionsMapping<T extends ITSProjectSettings> extends VSCodeExtensionsMapping<T>
{
    /**
     * Initializes a new instance of the `TSProjectExtensionsMapping<T>` class.
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
                return extension !== "digitalbrainstem.javascript-ejs-support";
            });
    }
}
