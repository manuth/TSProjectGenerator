import { IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { ComponentCollectionBase } from "../../Components/ComponentCollectionBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectGeneralCategory } from "./TSProjectGeneralCategory";

/**
 * Provides components for `TSProject`s.
 */
export class TSProjectComponentCollection<T extends ITSProjectSettings> extends ComponentCollectionBase<T>
{
    /**
     * Initializes a new instance of the `TSProjectComponentCollection<T>` class.
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
    public get Question(): string
    {
        return "What do you want to include in your project?";
    }

    /**
     * @inheritdoc
     */
    public get Categories(): Array<IComponentCategory<T>>
    {
        return [
            new TSProjectGeneralCategory(this.Generator)
        ];
    }
}
