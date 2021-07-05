import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";

/**
 * Provides the functionality to process json objects related to vscode.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class VSCodeJSONProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends JSONProcessor<TSettings, TOptions, TData>
{
    /**
     * The component of this processor.
     */
    private component: CodeWorkspaceComponent<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link VSCodeJSONProcessor `VSCodeJSONProcessor<TSettings, TOptions, TData>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component.Generator);
        this.component = component;
    }

    /**
     * Gets the generator of this component.
     */
    public override get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the component of this processor.
     */
    public get Component(): CodeWorkspaceComponent<TSettings, TOptions>
    {
        return this.component;
    }

    /**
     * Strips named workspace-folders (such as `${workspaceFolder:Example}`) from the given {@link value `value`}.
     *
     * @param value
     * The value containing the workspace-folder references to strip.
     *
     * @returns
     * A value containing `${workspaceFolder}` directives in place of named workspace-folders.
     */
    public StripWorkspaceFolder(value: string): string
    {
        return value.replace(/(?<=\$)(\{workspaceFolder):[^}]+(\})/g, "$1$2");
    }
}
