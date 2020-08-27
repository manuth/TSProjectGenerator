import { GeneratorOptions, IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorCategory } from "./TSGeneratorCategory";

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
    public get Categories(): Array<IComponentCategory<TSettings, TOptions>>
    {
        return [
            new TSProjectGeneralCategory(this.Generator),
            new TSGeneratorCategory(this.Generator)
        ];
    }
}
