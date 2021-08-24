import { ComponentCollectionOptions, GeneratorOptions, IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";
import { TSProjectGeneralCategory } from "./TSProjectGeneralCategory";

/**
 * Provides components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectComponentCollection<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentCollectionOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectComponentCollection `TSProjectComponentCollection<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Question(): string
    {
        return "What do you want to include in your project?";
    }

    /**
     * @inheritdoc
     */
    public get Categories(): Array<IComponentCategory<TSettings, TOptions>>
    {
        return [
            new TSProjectGeneralCategory(this.Generator)
        ];
    }
}
