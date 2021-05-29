import { join } from "path";
import { GeneratorOptions, IFileMapping } from "@manuth/extended-yo-generator";
import chalk = require("chalk");
import dedent = require("dedent");
import yosay = require("yosay");
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TSModulePackageFileMapping } from "./FileMappings/NPMPackaging/TSModulePackageFileMapping";

/**
 * Provides the functionality to generate a module written in TypeScript.
 */
export class TSModuleGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends TSProjectGenerator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSModuleGenerator` class.
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
        return "module";
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        let result: Array<IFileMapping<TSettings, TOptions>> = [];

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
            {
                Source: "index.ts.ejs",
                Destination: join(this.SourceRoot, "index.ts")
            },
            {
                Source: "main.test.ts.ejs",
                Destination: join(this.SourceRoot, "tests", "main.test.ts"),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            },
            {
                Source: "README.md",
                Destination: "README.md",
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
        this.log(yosay(`Welcome to the ${chalk.whiteBright.bold("TypeScript Module")} generator!`));
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
