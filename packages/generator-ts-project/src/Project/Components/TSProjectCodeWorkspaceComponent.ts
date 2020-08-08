import { IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../../VSCode/IWorkspaceMetadata";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectWorkspaceProcessor } from "../VSCode/TSProjectWorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace folder for `TSProject`s.
 */
export class TSProjectWorkspaceFolder<T extends ITSProjectSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSProjectCodeWorkspaceComponent<T>` class.
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
        return new TSProjectWorkspaceProcessor(this);
    }
}
