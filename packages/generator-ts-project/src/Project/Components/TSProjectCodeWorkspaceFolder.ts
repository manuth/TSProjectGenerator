import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { CodeWorkspaceProvider } from "../../VSCode/FileMappings/CodeWorkspaceProvider";
import { WorkspaceFileLoader } from "../../VSCode/FileMappings/WorkspaceFileLoader";
import { IWorkspaceMetadata } from "../../VSCode/IWorkspaceMetadata";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectWorkspaceProcessor } from "../VSCode/TSProjectWorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSProject`s.
 */
export class TSProjectCodeWorkspaceFolder<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceComponent<TSettings, TOptions>
{
    /**
     * Initializes a new isntance of the `TSProjectCodeWorkspaceFolder` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected get WorkspaceProcessor(): JSONProcessor<TSettings, TOptions, IWorkspaceMetadata>
    {
        return new TSProjectWorkspaceProcessor(this);
    }

    /**
     * @inheritdoc
     */
    public get Source(): CodeWorkspaceProvider<TSettings, TOptions>
    {
        return new WorkspaceFileLoader(this, this.Generator.modulePath("TSProjectGenerator.code-workspace"));
    }
}
