import { IGenerator } from "@manuth/extended-yo-generator";
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
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(".npmignore");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return ".npmignore";
            })();
    }

    /**
     * @inheritdoc
     */
    public async Processor(): Promise<void>
    {
        this.Generator.fs.write(
            await this.Destination,
            applyPatch(
                (await readFile(await this.Source)).toString(),
                parsePatch(
                    (await readFile(this.Generator.commonTemplatePath("npmignore.diff"))).toString()
                )[0]));
    }
}
