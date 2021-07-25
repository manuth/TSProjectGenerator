import { join } from "path";
import { GeneratorOptions, IFileMapping } from "@manuth/extended-yo-generator";
import { whiteBright } from "chalk";
import dedent = require("dedent");
import yosay = require("yosay");
import { GeneratorName } from "../../Core/GeneratorName";
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ModuleIndexFileMapping } from "../../Project/FileMappings/TypeScript/ModuleIndexFileMapping";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TSModulePackageFileMapping } from "./FileMappings/NPMPackaging/TSModulePackageFileMapping";

/**
 * Provides the functionality to generate a module written in TypeScript.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends TSProjectGenerator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`} class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: TOptions)
    {
        super(args, options);
    }

    /**
     * @inheritdoc
     */
    public override get TemplateRoot(): string
    {
        return GeneratorName.Module;
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        let self = this;
        let result: Array<IFileMapping<TSettings, TOptions>> = [];
        let readmeFileName = "README.md";

        for (let fileMapping of super.FileMappings)
        {
            if (fileMapping instanceof TSProjectPackageFileMapping)
            {
                result.push(new TSModulePackageFileMapping(this));
            }
            else
            {
                result.push(fileMapping);
            }
        }

        return [
            ...result,
            new class extends ModuleIndexFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return join(self.SourceRoot, "index.ts");
                }
            }(this),
            {
                Source: this.commonTemplatePath("test.ts.ejs"),
                Destination: join(this.SourceRoot, "tests", "main.test.ts"),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            },
            {
                Source: `${readmeFileName}.ejs`,
                Destination: readmeFileName,
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName],
                        Description: this.Settings[TSProjectSettingKey.Description]
                    };
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public override async prompting(): Promise<void>
    {
        this.log(yosay(`Welcome to the ${whiteBright.bold("TypeScript Module")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public override async writing(): Promise<void>
    {
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public override async install(): Promise<void>
    {
        return super.install();
    }

    /**
     * @inheritdoc
     */
    public override async cleanup(): Promise<void>
    {
        return super.cleanup();
    }

    /**
     * @inheritdoc
     */
    public override async end(): Promise<void>
    {
        await super.end();

        this.log("");

        this.log(
            dedent(
                `
                    Thanks for using TSModuleGenerator!`));
    }
}
