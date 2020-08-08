import { IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorWorkspaceProcessor } from "../VSCode/TSGeneratorWorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSGenerator`s.
 */
export class TSGeneratorCodeWorkspace<T extends ITSGeneratorSettings> extends TSProjectWorkspaceFolder<T>
{
    /**
     * Initializes a new isntance of the `TSGeneratorWorkspaceFolder<T>` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    protected get WorkspaceProcessor(): JSONProcessor<T, IWorkspaceMetadata>
    {
        return new TSGeneratorWorkspaceProcessor(this);
    }
}
