import { IFileMapping, GeneratorSettingKey, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { Constants } from "../../../Core/Constants";
import { GeneratorDependencies } from "../../../NPMPackaging/Dependencies/GeneratorDependencies";
import { LintDependencies } from "../../../NPMPackaging/Dependencies/LintDependencies";
import { IScriptMapping } from "../../../NPMPackaging/Scripts/IScriptMapping";
import { ScriptMapping } from "../../../NPMPackaging/Scripts/ScriptMapping";
import { TSProjectComponent } from "../../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey";
import { TSGeneratorDependencies } from "../Dependencies/TSGeneratorDependencies";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../Settings/TSGeneratorComponent";

/**
 * Represents a file-mapping for the `package.json` file.
 */
export class PackageFileMapping<T extends ITSGeneratorSettings> implements IFileMapping<T>
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
            }
        )();
    }

    /**
     * @inheritdoc
     */
    public get Processor(): IFileMapping<T>["Processor"]
    {
        return async (target, generator) =>
        {
            return generator.fs.writeJSON(await target.Destination, (await this.Package).ToJSON());
        };
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
                    name: this.Generator.Settings[TSProjectSettingKey.Name],
                    version: "0.0.0",
                    description: this.Generator.Settings[TSProjectSettingKey.Description],
                    author: {
                        name: this.Generator.user.git.name(),
                        email: this.Generator.user.git.email()
                    },
                    keywords: [
                        "yeoman-generator"
                    ]
                });
        }

        let scripts: Array<IScriptMapping<T> | string> = [
            "build",
            "rebuild",
            "watch",
            "clean",
            {
                Source: "lint-code",
                Destination: "lint"
            },
            {
                Source: "lint-code-compact",
                Destination: "lint-compact",
                Processor: async (script) => script.replace("lint-code", "lint")
            },
            "test",
            "prepare"
        ];

        result.Register(new TSGeneratorDependencies(), true);

        if (this.Generator.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
        {
            result.Register(new LintDependencies(), true);
        }

        if (
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample) ||
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
        {
            result.Register(new GeneratorDependencies(), true);
        }

        for (let script of scripts.map((script) => new ScriptMapping(this.Generator, script)))
        {
            if (Constants.Package.Scripts.Has(await script.Source))
            {
                if (result.Scripts.Has(await script.Destination))
                {
                    result.Scripts.Remove(await script.Destination);
                }

                result.Scripts.Add(await script.Destination, await script.Process(Constants.Package.Scripts.Get(await script.Source)));
            }
        }

        await result.Normalize();
        return result;
    }
}
