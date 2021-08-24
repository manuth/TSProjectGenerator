import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { WorkspaceProcessor } from "../../VSCode/WorkspaceProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";
import { TSProjectExtensionsProcessor } from "./TSProjectExtensionsProcessor";
import { TSProjectLaunchSettingsProcessor } from "./TSProjectLaunchSettingsProcessor";
import { TSProjectSettingsProcessor } from "./TSProjectSettingsProcessor";
import { TSProjectTasksProcessor } from "./TSProjectTasksProcessor";

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
