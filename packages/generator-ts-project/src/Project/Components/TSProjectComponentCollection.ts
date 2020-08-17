import { GeneratorOptions, IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { ComponentCollectionBase } from "../../Components/ComponentCollectionBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectGeneralCategory } from "./TSProjectGeneralCategory";

/**
 * Provides components for `TSProject`s.
 */
export class TSProjectComponentCollection<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentCollectionBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectComponentCollection` class.
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
