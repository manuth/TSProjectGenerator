import { FileMappingOptions, GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { applyPatch, parsePatch } from "diff";
import { readFile } from "fs-extra";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to copy the `.npmignore` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class NPMIgnoreFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends FileMappingOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link NPMIgnoreFileMapping `NPMIgnoreFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public override get Source(): string
    {
        return this.Generator.modulePath(".npmignore");
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return ".npmignore";
    }

    /**
     * Gets the name of the patch file.
     */
    protected get PatchFileName(): string
    {
        return this.Generator.commonTemplatePath("npmignore.diff");
    }

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        this.WriteDestination(
            applyPatch(
                (await readFile(this.Resolved.Source)).toString(),
                parsePatch(
                    (await readFile(this.PatchFileName)).toString()
                )[0]));
    }
}
