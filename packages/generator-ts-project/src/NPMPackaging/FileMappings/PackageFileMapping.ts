import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import fs from "fs-extra";
import { PackageJSONConverter } from "../../Components/Transformation/Conversion/PackageJSONConverter.js";
import { TextConverter } from "../../Components/Transformation/Conversion/TextConverter.js";
import { ParsedFileMapping } from "../../Components/Transformation/ParsedFileMapping.js";
import { IScriptMapping } from "../Scripts/IScriptMapping.js";
import { ScriptCollectionEditor } from "../Scripts/ScriptCollectionEditor.js";
import { ScriptMapping } from "../Scripts/ScriptMapping.js";

const { pathExists } = fs;

/**
 * Represents a file-mapping for a `package.json` file.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class PackageFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends ParsedFileMapping<TSettings, TOptions, Package>
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
     * @inheritdoc
     */
    public get Converter(): TextConverter<Package>
    {
        return new PackageJSONConverter(this.Resolved.Destination);
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return null;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The object to dump.
     */
    public override async GetSourceObject(): Promise<Package>
    {
        let npmPackage: Package;
        let sourceFileName = this.Resolved.Source;
        let outputFileName = this.Resolved.Destination;

        if (
            sourceFileName &&
            await pathExists(sourceFileName))
        {
            npmPackage = new Package(sourceFileName);
        }
        else if (await pathExists(outputFileName))
        {
            npmPackage = new Package(outputFileName);
        }
        else
        {
            npmPackage = new Package(
                outputFileName,
                {
                    version: "0.0.0",
                    author: {
                        name: this.Generator.user.git.name(),
                        email: this.Generator.user.git.email()
                    }
                });
        }

        npmPackage.FileName = outputFileName;
        await npmPackage.Normalize();
        return npmPackage;
    }

    /**
     * Gets the {@link Package `Package`} to write.
     *
     * @returns
     * The {@link Package `Package`} to write.
     */
    public async GetPackage(): Promise<Package>
    {
        return (
            async () =>
            {
                let result = await this.LoadPackage();

                for (let keyword of this.Keywords)
                {
                    if (!result.Keywords.includes(keyword))
                    {
                        result.Keywords.push(keyword);
                    }
                }

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
        return Package.FileName;
    }

    /**
     * Gets the keywords to add to the package.
     */
    public get Keywords(): string[]
    {
        return [];
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
            this.ScriptSource,
            () =>
            {
                return this.ScriptMappings.map(
                    (scriptMapping) =>
                    {
                        return new ScriptMapping(this.Generator, this.ScriptSource, scriptMapping);
                    });
            });
    }

    /**
     * Gets the package to load scripts from.
     */
    public get ScriptSource(): Package
    {
        return new Package();
    }

    /**
     * @inheritdoc
     */
    public override async Processor(): Promise<void>
    {
        this.Generator.fs.writeJSON(this.Resolved.Destination, {});
        this.Generator.packageJson.merge((await this.GetPackage()).ToJSON());
    }

    /**
     * Loads the package.
     *
     * @returns
     * The loaded package.
     */
    protected async LoadPackage(): Promise<Package>
    {
        return this.GetSourceObject();
    }
}
