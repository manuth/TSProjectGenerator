import { IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleGeneralCategory } from "./TSModuleGeneralCategory";

/**
 * Provides components for `TSModule`s.
 */
export class TSModuleComponentCollection<T extends ITSProjectSettings> extends TSProjectComponentCollection<T>
{
    /**
     * Initializes a new instance of the `TSModuleComponentCollection<T>` class.
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
            new TSModuleGeneralCategory(this.Generator)
        ];
    }
}
