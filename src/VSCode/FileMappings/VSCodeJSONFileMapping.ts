import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../../Project/ITSProjectSettings";
import { VSCodeWorkspaceFileMapping } from "./VSCodeWorkspaceFileMapping";

/**
 * Provides a file-mapping for a vscode workspace file written in `.json` or `.jsonc`.
 */
export abstract class VSCodeJSONFileMapping<T extends ITSProjectSettings> extends VSCodeWorkspaceFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeJSONFileMapping` class.
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
     */
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        generator.fs.write(await fileMapping.Destination, JSON.stringify(await this.GetMetadata(fileMapping, generator), null, 4));
    }

    /**
     * Gets the metadata to write into the file.
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
    protected abstract async GetMetadata(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<any>;
}
