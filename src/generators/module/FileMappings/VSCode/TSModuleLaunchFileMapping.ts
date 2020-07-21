import { TSProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";

/**
 * Provides a file-mapping for copying the `launch.json` file for a `TSModule`.
 */
export class TSModuleLaunchFileMapping<T extends ITSProjectSettings> extends TSProjectLaunchFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSModuleLaunchFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<ILaunchFile>
    {
        let metadata = super.Metadata;

        return (
            async () =>
            {
                let result = await metadata;

                result.configurations.unshift(
                    {
                        type: "pwa-node",
                        request: "launch",
                        name: "Launch Program",
                        program: "${workspaceFolder}/lib/index.js",
                        preLaunchTask: "Build",
                        sourceMaps: true
                    });

                return result;
            })();
    }
}
