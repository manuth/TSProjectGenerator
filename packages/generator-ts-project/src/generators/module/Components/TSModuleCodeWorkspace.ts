import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TSModuleWorkspaceProcessor } from "../VSCode/TSModuleWorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSModule`s.
 */
export class TSModuleCodeWorkspace<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectWorkspaceFolder<TSettings, TOptions>
{
    /**
     * Initializes a new isntance of the `TSModuleWorkspaceFolder` class.
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
        return new TSModuleWorkspaceProcessor(this);
    }
}
