import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { IExtensionFile } from "./IExtensionFile";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode-extensions.
 */
export class ExtensionsProcessor<T extends IGeneratorSettings> extends VSCodeJSONProcessor<T, IExtensionFile>
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
    public async Process(data: IExtensionFile): Promise<IExtensionFile>
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
