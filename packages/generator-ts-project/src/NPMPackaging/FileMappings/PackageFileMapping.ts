import { FileMappingOptions, GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { IScriptMapping } from "../Scripts/IScriptMapping";
import { ScriptCollectionEditor } from "../Scripts/ScriptCollectionEditor";
import { ScriptMapping } from "../Scripts/ScriptMapping";

/**
 * Represents a file-mapping for a `package.json` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class PackageFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends FileMappingOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link PackageFileMapping `PackageFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets the package to write.
     */
    public get Package(): Promise<Package>
    {
        return (
            async () =>
            {
                let result = await this.LoadPackage();

                for (let scriptMapping of this.ScriptMappingCollection.Items)
                {
                    if (result.Scripts.Has(scriptMapping.Destination))
                    {
                        result.Scripts.Remove(scriptMapping.Destination);
                    }

                    result.Scripts.Add(scriptMapping.Destination, await scriptMapping.Processor());
                }

                return result;
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return "package.json";
    }

    /**
     * Gets the scripts to copy from the template-package.
     */
    protected get ScriptMappings(): Array<IScriptMapping<TSettings, TOptions> | string>
    {
        return [];
    }

    /**
     * Gets the resolved representations of the scripts to copy from the template-package.
     */
    public get ScriptMappingCollection(): ScriptCollectionEditor
    {
        return new ScriptCollectionEditor(
            this.Generator,
            this.SourcePackage,
            () =>
            {
                return this.ScriptMappings.map(
                    (scriptMapping) =>
                    {
                        return new ScriptMapping(this.Generator, this.SourcePackage, scriptMapping);
                    });
            });
    }

    /**
     * Gets the package to load scripts from.
     */
    protected get SourcePackage(): Promise<Package>
    {
        return (
            async () =>
            {
                return new Package();
            })();
    }

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        this.Generator.fs.writeJSON(this.Resolved.Destination, {});
        this.Generator.packageJson.merge((await this.Package).ToJSON());
    }

    /**
     * Gets the template of the package to write.
     *
     * @returns
     * The template of the package to write.
     */
    protected async GetTemplate(): Promise<Package>
    {
        let npmPackage: Package;
        let fileName = this.Resolved.Destination;

        if (await pathExists(fileName))
        {
            npmPackage = new Package(fileName);
        }
        else
        {
            npmPackage = new Package(
                fileName,
                {
                    version: "0.0.0",
                    author: {
                        name: this.Generator.user.git.name(),
                        email: this.Generator.user.git.email()
                    }
                });
        }

        await npmPackage.Normalize();
        return npmPackage;
    }

    /**
     * Loads the package.
     *
     * @returns
     * The loaded package.
     */
    protected async LoadPackage(): Promise<Package>
    {
        return this.GetTemplate();
    }
}
