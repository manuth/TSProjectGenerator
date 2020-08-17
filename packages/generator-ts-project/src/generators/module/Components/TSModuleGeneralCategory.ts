import { GeneratorOptions, IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleCodeWorkspace } from "./TSModuleCodeWorkspace";

/**
 * Provides general components for `TSModule`s.
 */
export class TSModuleGeneralCategory<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectGeneralCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSModuleGeneralCategory` class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected get WorkspaceComponent(): IComponent<TSettings, TOptions>
    {
        return new TSModuleCodeWorkspace(this.Generator);
    }
}
