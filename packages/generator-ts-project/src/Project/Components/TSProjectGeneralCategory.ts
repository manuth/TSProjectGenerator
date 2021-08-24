import { ComponentCategoryOptions, GeneratorOptions, IComponent, IGenerator } from "@manuth/extended-yo-generator";
import { LintingComponent } from "../../Linting/Components/LintingComponent";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";
import { TSProjectCodeWorkspaceFolder } from "./TSProjectCodeWorkspaceFolder";

/**
 * Provides general components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectGeneralCategory<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends ComponentCategoryOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectGeneralCategory `TSProjectGeneralCategory<TSettings, TOptions>`} class.
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
