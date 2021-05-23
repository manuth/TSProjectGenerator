import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { FileMappingBase } from "../../Components/FileMappingBase";
import { IScriptMapping } from "../Scripts/IScriptMapping";
import { ScriptMapping } from "../Scripts/ScriptMapping";

/**
 * Represents a file-mapping for a `package.json` file.
 */
export class PackageFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends FileMappingBase<TSettings, TOptions>
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

                for (let scriptMapping of await this.ScriptMappingCollection)
                {
                    if (result.Scripts.Has(scriptMapping.Destination))
                    {
                        result.Scripts.Remove(scriptMapping.Destination);
                    }

                    result.Scripts.Add(scriptMapping.Destination, await scriptMapping.Process((await this.Template).Scripts.Get(scriptMapping.Source)));
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
    protected get ScriptMappings(): Promise<Array<IScriptMapping<TSettings, TOptions> | string>>
    {
        return (
            async (): Promise<Array<IScriptMapping<TSettings, TOptions> | string>> =>
            {
                return [];
            })();
    }

    /**
     * Gets the resolved representations of the scripts to copy from the template-package.
     */
    protected get ScriptMappingCollection(): Promise<Array<ScriptMapping<TSettings, TOptions>>>
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
    public async Processor(): Promise<void>
    {
        this.Generator.fs.writeJSON(this.Resolved.Destination, {});
        this.Generator.packageJson.merge((await this.Package).ToJSON());
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
        let fileName = this.Resolved.Destination;

        if (this.package === null)
        {
            if (await pathExists(fileName))
            {
                this.package = new Package(fileName);
            }
            else
            {
                this.package = new Package(
                    fileName,
                    {
                        version: "0.0.0",
                        author: {
                            name: this.Generator.user.git.name(),
                            email: this.Generator.user.git.email()
                        }
                    });
            }

            await this.package.Normalize();
        }

        return this.package;
    }
}
