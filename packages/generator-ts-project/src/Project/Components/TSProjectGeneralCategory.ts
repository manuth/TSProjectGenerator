import { IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { ComponentCategoryBase } from "../../Components/ComponentCategoryBase";
import { LintingComponent } from "../../Linting/Components/LintingComponent";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectWorkspaceFolder } from "./TSProjectCodeWorkspaceComponent";

/**
 * Provides general components for `TSProject`s.
 */
export class TSProjectGeneralCategory<T extends ITSProjectSettings> extends ComponentCategoryBase<T>
{
    /**
     * Initializes a new instance of the `TSProjectGeneralCategory<T>` class.
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
    public get DisplayName(): string
    {
        return "General";
    }

    /**
     * @inheritdoc
     */
    public get Components(): Array<IComponent<T>>
    {
        return [
            this.LintingComponent,
            this.WorkspaceComponent
        ];
    }

    /**
     * Provides a component for creating a linting-environment.
     */
    protected get LintingComponent(): IComponent<T>
    {
        return new LintingComponent(this.Generator);
    }

    /**
     * Provides a component for creating a vscode-environment.
     */
    protected get WorkspaceComponent(): IComponent<T>
    {
        return new TSProjectWorkspaceFolder(this.Generator);
    }
}
