import { GeneratorOptions, IComponentCategory, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleGeneralCategory } from "./TSModuleGeneralCategory";

/**
 * Provides components for `TSModule`s.
 */
export class TSModuleComponentCollection<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectComponentCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSModuleComponentCollection` class.
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
            new TSModuleGeneralCategory(this.Generator)
        ];
    }
}
