import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";

/**
 * Provides a file-mapping for copying the `launch.json` file for a `TSModule`.
 */
export class TSModuleLaunchFileMapping<T extends ITSProjectSettings> extends TSProjectLaunchFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSModuleLaunchFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The target of the resolve.
     *
     * @param generator
     * The generator of the target.
     *
     * @returns
     * The metadata to write into the file.
     */
    protected async GetMetadata(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<ILaunchFile>
    {
        let result = await super.GetMetadata(fileMapping, generator);

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
