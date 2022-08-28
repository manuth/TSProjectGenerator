import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor.js";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent.js";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings.js";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings.js";
import { ITaskSettings } from "../../VSCode/ITaskSettings.js";
import { WorkspaceProcessor } from "../../VSCode/WorkspaceProcessor.js";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator.js";
import { TSProjectExtensionsProcessor } from "./TSProjectExtensionsProcessor.js";
import { TSProjectLaunchSettingsProcessor } from "./TSProjectLaunchSettingsProcessor.js";
import { TSProjectSettingsProcessor } from "./TSProjectSettingsProcessor.js";
import { TSProjectTasksProcessor } from "./TSProjectTasksProcessor.js";

/**
 * Provides the functionality to process workspaces for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectWorkspaceProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends WorkspaceProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectWorkspaceProcessor `TSProjectWorkspaceProcessor<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     */
    protected override get ExtensionsProcessor(): JSONProcessor<TSettings, TOptions, IExtensionSettings>
    {
        return new TSProjectExtensionsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected override get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new TSProjectLaunchSettingsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected override get SettingsProcessor(): JSONProcessor<TSettings, TOptions, Record<string, any>>
    {
        return new TSProjectSettingsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected override get TasksProcessor(): JSONProcessor<TSettings, TOptions, ITaskSettings>
    {
        return new TSProjectTasksProcessor(this.Component);
    }
}
