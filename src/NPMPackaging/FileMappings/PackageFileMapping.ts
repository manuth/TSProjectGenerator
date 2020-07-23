import { IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { IScriptMapping } from "../Scripts/IScriptMapping";
import { ScriptMapping } from "../Scripts/ScriptMapping";

/**
 * Represents a file-mapping for a `package.json` file.
 */
export class PackageFileMapping<T extends IGeneratorSettings> extends FileMappingBase<T>
{
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
                if (this.package === null)
                {
                    this.package = await this.LoadPackage();
                }

                return this.package;
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
                return "package.json";
            })();
    }

    /**
     * Gets the scripts to copy from the template-package.
     */
    protected get ScriptMappings(): Promise<Array<IScriptMapping<T> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<T> | string>> =>
            {
                return [];
            })();
    }

    /**
     * Gets the resolved representations of the scripts to copy from the template-package.
     */
    protected get ScriptMappingCollection(): Promise<Array<ScriptMapping<T>>>
    {
        return (
            async () =>
            {
                return (await this.ScriptMappings).map(
                    (scriptMapping) =>
                    {
                        return new ScriptMapping(this.Generator, scriptMapping);
                    });
            })();
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
     * @inheritdoc
     */
    public Processor(): Promise<void>
    {
        return (async () =>
        {
            this.Generator.fs.writeJSON(await this.Resolved.Destination, (await this.Package).ToJSON());
        })();
    }

    /**
     * Clears the cached package.
     */
    public async Clear(): Promise<void>
    {
        this.package = null;
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
        let fileName = await this.Resolved.Destination;

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

        for (let scriptMapping of await this.ScriptMappingCollection)
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
