import { IComponentCategory } from "@manuth/extended-yo-generator";
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
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     */
    public get Categories(): Array<IComponentCategory<T>>
    {
        return [
            new TSModuleGeneralCategory()
        ];
    }
}
