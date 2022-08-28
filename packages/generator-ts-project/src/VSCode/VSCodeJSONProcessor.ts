import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../Components/JSONProcessor.js";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent.js";

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
     * Creates a workspace-folder directive.
     *
     * @param name
     * The name of the workspace-folder.
     *
     * @returns
     * A normal workspace-folder directive or a named workspace-folder directive if a {@link name `name`} is passed.
     */
    public GetWorkspaceFolderDirective(name?: string): string
    {
        return `\${workspaceFolder${name ? `:${name}` : ""}}`;
    }

    /**
     * Strips named workspace-folders (such as `${workspaceFolder:Example}`) from the specified {@link value `value`}.
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
