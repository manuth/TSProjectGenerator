import { IFileMapping, Generator, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { Constants } from "../../Core/Constants";
import { CommonDependencies } from "../../NPMPackaging/CommonDependencies";
import { GeneratorDependencies } from "../../NPMPackaging/GeneratorDependencies";
import { IScriptMapping } from "../../NPMPackaging/IScriptMapping";
import { LintDependencies } from "../../NPMPackaging/LintDependencies";
import { ITSGeneratorSettings } from "./ITSGeneratorSettings";
import { TSGeneratorComponent } from "./TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./TSGeneratorSetting";

/**
 * Represents a file-mapping for the `package.json` file.
 */
export class PackageFileMapping<T extends ITSGeneratorSettings> implements IFileMapping<T>
{
    /**
     * The generator of the file-mapping.
     */
    private generator: Generator<T>;

    /**
     * The package to write.
     */
    private package: Package = null;

    /**
     * Initializes a new instance of the `PackageFileMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: Generator<T>)
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
    public get Generator(): Generator<T>
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
                    name: this.Generator.Settings[TSGeneratorSettingKey.Name],
                    version: "0.0.0",
                    description: this.Generator.Settings[TSGeneratorSettingKey.Description],
                    author: {
                        name: this.Generator.user.git.name(),
                        email: this.Generator.user.git.email()
                    },
                    keywords: [
                        "yeoman-generator"
                    ]
                });
        }

        let scripts: Array<IScriptMapping | string> = [
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
                Processor: (script) => script.replace("lint-code", "lint")
            },
            "test",
            "prepare"
        ];

        result.Register(new CommonDependencies(), true);

        if (this.Generator.Settings[GeneratorSettingKey.Components].indexOf(TSGeneratorComponent.Linting))
        {
            result.Register(new LintDependencies(), true);
        }

        if (
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample) ||
            this.Generator.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
        {
            result.Register(new GeneratorDependencies(), true);
        }

        for (let script of scripts)
        {
            if (typeof script === "string")
            {
                script = {
                    Source: script,
                    Destination: script
                };
            }

            if (Constants.Package.Scripts.Has(script.Source))
            {
                let processor = script.Processor ?? ((script) => script);

                if (result.Scripts.Has(script.Destination))
                {
                    result.Scripts.Remove(script.Destination);
                }

                result.Scripts.Add(script.Destination, processor(Constants.Package.Scripts.Get(script.Source)));
            }
        }

        await result.Normalize();
        return result;
    }
}
