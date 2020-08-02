import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { VSCodeExtensionsMapping } from "../../../VSCode/FileMappings/VSCodeExtensionsMapping";

/**
 * Provides an implementation of the `VSCodeExtensionsMapping` class for testing.
 */
export class TestExtensionsMapping<T extends IGeneratorSettings> extends VSCodeExtensionsMapping<T>
{
    /**
     * Filters extensions.
     *
     * @param extensions
     * The extensions to filter.
     *
     * @returns
     * The filtered extensions.
     */
    public Filter: (extensions: string[]) => Promise<string[]> = null;

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
        return (this.Filter ?? super.FilterRecommendations)(recommendations);
    }
}
