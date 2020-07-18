import { IComponent } from "@manuth/extended-yo-generator";
import { ComponentCategoryBase } from "../../Components/ComponentCategoryBase";
import { LintingComponent } from "../../Linting/Components/LintingComponent";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectCodeWorkspaceComponent } from "./TSProjectCodeWorkspaceComponent";

/**
 * Provides general components for `TSProject`s.
 */
export class TSProjectGeneralCategory<T extends ITSProjectSettings> extends ComponentCategoryBase<T>
{
    /**
     * Initializes a new instance of the `TSProjectGeneralCategory<T>` class.
     */
    public constructor()
    {
        super();
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
        return new LintingComponent();
    }

    /**
     * Provides a component for creating a vscode-environment.
     */
    protected get WorkspaceComponent(): IComponent<T>
    {
        return new TSProjectCodeWorkspaceComponent();
    }
}
