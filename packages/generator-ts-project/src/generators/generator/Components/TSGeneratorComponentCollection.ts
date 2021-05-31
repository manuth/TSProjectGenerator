import { GeneratorOptions, IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorCategory } from "./TSGeneratorCategory";
import { TSGeneratorGeneralCategory } from "./TSGeneratorGeneralCategory";

/**
 * Provides components for `TSGenerator`s.
 */
export class TSGeneratorComponentCollection<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectComponentCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorComponentCollection` class.
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
    public override get Categories(): Array<IComponentCategory<TSettings, TOptions>>
    {
        return [
            new TSGeneratorGeneralCategory(this.Generator),
            new TSGeneratorCategory(this.Generator)
        ];
    }
}
