import { TSProjectExtensionsMapping } from "../../../../Project/FileMappings/VSCode/TSProjectExtensionsMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";

/**
 * Provides a file-mapping for copying the `extensions.json` file for `TSGenerator`s.
 */
export class TSGeneratorExtensionsMapping<T extends ITSProjectSettings> extends TSProjectExtensionsMapping<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorExtensionsMapping<T>` class.
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
        return recommendations;
    }
}
