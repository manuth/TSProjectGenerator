import { IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleWorkspaceFolder } from "./TSModuleWorkspaceFolder";

/**
 * Provides general components for `TSModule`s.
 */
export class TSModuleGeneralCategory<T extends ITSProjectSettings> extends TSProjectGeneralCategory<T>
{
    /**
     * Initializes a new instance of the `TSModuleGeneralCategory<T>` class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected get WorkspaceComponent(): IComponent<T>
    {
        return new TSModuleWorkspaceFolder(this.Generator);
    }
}
