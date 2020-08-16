import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectLaunchFileProcessor } from "../../../Project/VSCode/TSProjectLaunchFileProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";

/**
 * Provides the functionality to process debug-configurations for `TSModule`s.
 */
export class TSModuleLaunchFileProcessor<T extends ITSProjectSettings> extends TSProjectLaunchFileProcessor<T>
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
    public async Process(data: ILaunchSettings): Promise<ILaunchSettings>
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
