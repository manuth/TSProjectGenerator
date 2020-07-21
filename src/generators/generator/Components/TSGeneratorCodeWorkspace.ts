import { IFileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSGeneratorExtensionsMapping } from "../FileMappings/VSCode/TSGeneratorExtensionsMapping";
import { TSGeneratorLaunchFileMapping } from "../FileMappings/VSCode/TSGeneratorLaunchFileMapping";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";

/**
 * Provides a component for creating a vscode-workspace for `TSGenerator`s.
 */
export class TSGeneratorCodeWorkspace<T extends ITSGeneratorSettings> extends TSProjectCodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSGeneratorCodeWorkspace<T>` class.
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
    protected get ExtensionsFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSGeneratorExtensionsMapping(this);
            })();
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileMapping(): Promise<IFileMapping<T>>
    {
        return (
            async () =>
            {
                return new TSGeneratorLaunchFileMapping(this);
            })();
    }
}
