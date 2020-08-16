import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "./IExtensionSettings";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode-extensions.
 */
export class ExtensionsProcessor<T extends IGeneratorSettings> extends VSCodeJSONProcessor<T, IExtensionSettings>
{
    /**
     * Initializes a new instance of the `ExtensionsProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: IExtensionSettings): Promise<IExtensionSettings>
    {
        let result = await super.Process(data);

        if (result?.recommendations)
        {
            result.recommendations = await this.FilterRecommendations(result.recommendations);
        }

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
