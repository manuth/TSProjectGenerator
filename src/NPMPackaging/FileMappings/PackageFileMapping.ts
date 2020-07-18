import { IFileMapping, IGenerator, FileProcessor, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { IScriptMapping } from "../Scripts/IScriptMapping";
import { ScriptMapping } from "../Scripts/ScriptMapping";

/**
 * Represents a file-mapping for a `package.json` file.
 */
export class PackageFileMapping<T extends IGeneratorSettings> implements IFileMapping<T>
{
    /**
     * The generator of the file-mapping.
     */
    private generator: IGenerator<T>;

    /**
     * The package to write.
     */
    private package: Package = null;

    /**
     * Initializes a new instance of the `PackageFileMapping<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        this.generator = generator;
    }

    /**
     * Gets the package to write.
     */
    public get Package(): Promise<Package>
    {
        return (
            async () =>
            {
                if (this.package === null)
                {
                    this.package = await this.LoadPackage();
                }

                return this.package;
            })();
    }

    /**
     * Gets the generator of the file-mapping.
     */
    public get Generator(): IGenerator<T>
    {
        return this.generator;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return (await this.Package).FileName;
            })();
    }

    /**
     * @inheritdoc
     */
    public get Processor(): FileProcessor<T>
    {
        return async (target, generator) =>
        {
            return generator.fs.writeJSON(await target.Destination, (await this.Package).ToJSON());
        };
    }

    /**
     * Gets the scripts to copy from the template-package.
     */
    protected get ScriptMappings(): Array<IScriptMapping<T> | string>
    {
        return [];
    }

    /**
     * Gets the resolved representations of the scripts to copy from the template-package.
     */
    protected get ScriptMappingCollection(): Array<ScriptMapping<T>>
    {
        return this.ScriptMappings.map(
            (scriptMapping) =>
            {
                return new ScriptMapping(this.Generator, scriptMapping);
            });
    }

    /**
     * Gets the template package.
     */
    protected get Template(): Promise<Package>
    {
        return (
            async () =>
            {
                return new Package();
            })();
    }

    /**
     * Loads the package.
     *
     * @returns
     * The loaded package.
     */
    protected async LoadPackage(): Promise<Package>
    {
        let result: Package;
        let fileName = this.Generator.destinationPath("package.json");

        if (await pathExists(fileName))
        {
            result = new Package(fileName);
        }
        else
        {
            result = new Package(
                fileName,
                {
                    version: "0.0.0",
                    author: {
                        name: this.Generator.user.git.name(),
                        email: this.Generator.user.git.email()
                    }
                });
        }

        for (let scriptMapping of this.ScriptMappingCollection)
        {
            if (result.Scripts.Has(await scriptMapping.Destination))
            {
                result.Scripts.Remove(await scriptMapping.Destination);
            }

            result.Scripts.Add(await scriptMapping.Destination, await scriptMapping.Process((await this.Template).Scripts.Get(await scriptMapping.Source)));
        }

        await result.Normalize();
        return result;
    }
}
