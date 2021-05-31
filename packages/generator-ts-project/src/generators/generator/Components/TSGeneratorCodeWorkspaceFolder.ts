import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorWorkspaceProcessor } from "../VSCode/TSGeneratorWorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSGenerator`s.
 */
export class TSGeneratorCodeWorkspaceFolder<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectCodeWorkspaceFolder<TSettings, TOptions>
{
    /**
     * Initializes a new isntance of the `TSGeneratorCodeWorkspaceFolder` class.
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
