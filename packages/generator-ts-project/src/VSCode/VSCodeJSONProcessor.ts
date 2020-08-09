import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";

/**
 * Provides the functionality to process json objects related to vscode.
 */
export class VSCodeJSONProcessor<T extends IGeneratorSettings, TData> extends JSONProcessor<T, TData>
{
    /**
     * The component of this processor.
     */
    private component: CodeWorkspaceComponent<T>;

    /**
     * Initializes a new instance of the `CodeFileProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component.Generator);
        this.component = component;
    }

    /**
     * Gets the generator of this component.
     */
    public get Generator(): IGenerator<T>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the component of this processor.
     */
    public get Component(): CodeWorkspaceComponent<T>
    {
        return this.component;
    }

    /**
     * Strips named workspace-folders (such as `${workspaceFolder:Example}`) from the given `value`.
     *
     * @param value
     * The value containing the workspace-folder references to strip.
     *
     * @returns
     * A value containing `${workspaceFolder}` directives in place of named workspace-folders.
     */
    public StripWorkspaceFolder(value: string): string
    {
        return value.replace(/(\$\{workspaceFolder):.*?(\})/g, "$1$2");
    }
}
