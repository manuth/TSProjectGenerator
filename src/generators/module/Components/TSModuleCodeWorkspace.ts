import { IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSModuleLaunchFileMapping } from "../FileMappings/VSCode/TSModuleLaunchFileMapping";

/**
 * Provides a component for creating a vscode-workspace for `TSModule`s.
 */
export class TSModuleCodeWorkspace<T extends ITSProjectSettings> extends TSProjectCodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSModuleCodeWorkspace<T>` class.
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
    protected get LaunchFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSModuleLaunchFileMapping(this);
            })();
    }
}
