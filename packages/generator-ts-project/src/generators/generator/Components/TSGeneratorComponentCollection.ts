import { GeneratorOptions, IComponentCategory } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator";
import { TSGeneratorCategory } from "./TSGeneratorCategory";
import { TSGeneratorGeneralCategory } from "./TSGeneratorGeneralCategory";

/**
 * Provides components for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorComponentCollection<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectComponentCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorComponentCollection `TSGeneratorComponentCollection<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: TSProjectGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public override get Generator(): TSProjectGenerator<TSettings, TOptions>
    {
        return super.Generator as TSProjectGenerator<TSettings, TOptions>;
    }

    /**
     * @inheritdoc
     */
    public override get Categories(): Array<IComponentCategory<TSettings, TOptions>>
    {
        return [
            new TSGeneratorGeneralCategory(this.Generator),
            new TSGeneratorCategory(this.Generator)
        ];
    }
}
