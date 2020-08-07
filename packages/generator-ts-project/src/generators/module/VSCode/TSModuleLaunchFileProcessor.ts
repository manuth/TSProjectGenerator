import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { LaunchFileProcessor } from "../../../VSCode/LaunchFileProcessor";

/**
 * Provides the functionality to process debug-configurations for `TSModule`s.
 */
export class TSModuleLaunchFileProcessor<T extends ITSProjectSettings> extends LaunchFileProcessor<T>
{
    /**
     * Initializes a new instance of the `TSModuleLaunchFileProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: ILaunchFile): Promise<ILaunchFile>
    {
        let result = await super.Process(data);

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
    }
}
