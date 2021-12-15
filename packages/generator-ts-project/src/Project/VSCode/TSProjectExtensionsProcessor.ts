import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TSProjectComponent } from "../..";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { ExtensionsProcessor } from "../../VSCode/ExtensionsProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";

/**
 * Provides the functionality to process extensions for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectExtensionsProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ExtensionsProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectExtensionsProcessor `TSProjectExtensionsProcessor<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
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
    protected override async FilterRecommendations(recommendations: string[]): Promise<string[]>
    {
        return recommendations.filter(
            (extension) =>
            {
                return extension !== "digitalbrainstem.javascript-ejs-support" &&
                    (
                        extension !== "dbaeumer.vscode-eslint" ||
                        this.Generator.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting));
            });
    }
}
