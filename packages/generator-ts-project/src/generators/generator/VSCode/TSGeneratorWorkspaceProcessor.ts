import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor.js";
import { TSProjectWorkspaceProcessor } from "../../../Project/VSCode/TSProjectWorkspaceProcessor.js";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent.js";
import { ExtensionsProcessor } from "../../../VSCode/ExtensionsProcessor.js";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings.js";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";
import { TSGeneratorLaunchSettingsProcessor } from "./TSGeneratorLaunchSettingsProcessor.js";

/**
 * Provides the functionality to process workspaces for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorWorkspaceProcessor<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectWorkspaceProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorWorkspaceProcessor `TSGeneratorWorkspaceProcessor<TSettings, TOptions>`} class.
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
        return new ExtensionsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected override get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new TSGeneratorLaunchSettingsProcessor(this.Component);
    }
}
