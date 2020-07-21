import { IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorGeneralCategory } from "./TSGeneratorGeneralCategory";

/**
 * Provides components for `TSGenerator`s.
 */
export class TSGeneratorComponentCollection<T extends ITSGeneratorSettings> extends TSProjectComponentCollection<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorComponentCollection<T>` class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Categories(): Array<IComponentCategory<T>>
    {
        return [
            new TSGeneratorGeneralCategory(this.Generator)
        ];
    }
}
