import { GeneratorOptions, IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { ComponentCategoryBase } from "../../Components/ComponentCategoryBase";
import { LintingComponent } from "../../Linting/Components/LintingComponent";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectCodeWorkspaceFolder } from "./TSProjectCodeWorkspaceFolder";

/**
 * Provides general components for `TSProject`s.
 */
export class TSProjectGeneralCategory<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentCategoryBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectGeneralCategory` class.
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
    public get DisplayName(): string
    {
        return "General";
    }

    /**
     * @inheritdoc
     */
    public get Components(): Array<IComponent<TSettings, TOptions>>
    {
        return [
            this.LintingComponent,
            this.WorkspaceComponent
        ];
    }

    /**
     * Provides a component for creating a linting-environment.
     */
    protected get LintingComponent(): IComponent<TSettings, TOptions>
    {
        return new LintingComponent(this.Generator);
    }

    /**
     * Provides a component for creating a vscode-environment.
     */
    protected get WorkspaceComponent(): IComponent<TSettings, TOptions>
    {
        return new TSProjectCodeWorkspaceFolder(this.Generator);
    }
}
