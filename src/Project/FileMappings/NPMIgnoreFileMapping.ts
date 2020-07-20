import { FileMapping, IGenerator } from "@manuth/extended-yo-generator";
import { applyPatch, parsePatch } from "diff";
import { readFile } from "fs-extra";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to copy the `.npmignore` file.
 */
export class NPMIgnoreFileMapping<T extends ITSProjectSettings> extends FileMappingBase<T>
{
    /**
     * Initializes a new instance of the `NPMIgnoreFileMapping` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The source of the file-mapping.
     */
    public async Source(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return generator.modulePath(".npmignore");
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The resolved representation of the file-mapping.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The destination of the file-mapping.
     */
    public async Destination(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<string>
    {
        return ".npmignore";
    }

    /**
     * @inheritdoc
     *
     * @param fileMapping
     * The file-mapping to process.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public async Processor(fileMapping: FileMapping<T>, generator: IGenerator<T>): Promise<void>
    {
        generator.fs.write(
            await fileMapping.Destination,
            applyPatch(
                (await readFile(await fileMapping.Source)).toString(),
                parsePatch(
                    (await readFile(generator.commonTemplatePath("npmignore.diff"))).toString()
                )[0]));
    }
}
