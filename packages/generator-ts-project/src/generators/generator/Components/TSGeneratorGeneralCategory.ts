import { GeneratorOptions, IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";
import { TSGeneratorCodeWorkspaceFolder } from "./TSGeneratorCodeWorkspaceFolder.js";

/**
 * Provides general components for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorGeneralCategory<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectGeneralCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorGeneralCategory `TSGeneratorGeneralCategory<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected override get WorkspaceComponent(): IComponent<TSettings, TOptions>
    {
        return new TSGeneratorCodeWorkspaceFolder(this.Generator);
    }
}
