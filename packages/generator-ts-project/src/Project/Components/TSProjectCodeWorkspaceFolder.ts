import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor.js";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent.js";
import { CodeWorkspaceProvider } from "../../VSCode/FileMappings/CodeWorkspaceProvider.js";
import { WorkspaceFileLoader } from "../../VSCode/FileMappings/WorkspaceFileLoader.js";
import { IWorkspaceMetadata } from "../../VSCode/IWorkspaceMetadata.js";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator.js";
import { TSProjectWorkspaceProcessor } from "../VSCode/TSProjectWorkspaceProcessor.js";

/**
 * Provides a component for creating a vscode-workspace folder for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectCodeWorkspaceFolder<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceComponent<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectCodeWorkspaceFolder `TSProjectCodeWorkspaceFolder<TSettings, TOptions>`} class.
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
    protected override get WorkspaceProcessor(): JSONProcessor<TSettings, TOptions, IWorkspaceMetadata>
    {
        return new TSProjectWorkspaceProcessor(this);
    }

    /**
     * @inheritdoc
     */
    public override get Source(): CodeWorkspaceProvider<TSettings, TOptions>
    {
        return new WorkspaceFileLoader(this, this.Generator.modulePath("TSProjectGenerator.code-workspace"));
    }
}
