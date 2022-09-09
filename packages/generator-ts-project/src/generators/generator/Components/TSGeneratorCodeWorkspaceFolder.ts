import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor.js";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder.js";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";
import { TSGeneratorWorkspaceProcessor } from "../VSCode/TSGeneratorWorkspaceProcessor.js";

/**
 * Provides a component for creating a vscode-workspace folder for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorCodeWorkspaceFolder<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectCodeWorkspaceFolder<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorCodeWorkspaceFolder `TSGeneratorCodeWorkspaceFolder<TSettings, TOptions>`} class.
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
        return new TSGeneratorWorkspaceProcessor(this);
    }
}
