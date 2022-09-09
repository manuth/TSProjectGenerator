import { join } from "node:path";
import { GeneratorOptions, IFileMapping } from "@manuth/extended-yo-generator";
import chalk from "chalk";
import dedent from "dedent";
import yosay from "yosay";
import { GeneratorName } from "../../Core/GeneratorName.js";
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackaging/TSProjectPackageFileMapping.js";
import { ISuiteContext } from "../../Project/FileMappings/TypeScript/ISuiteContext.js";
import { ModuleIndexFileMapping } from "../../Project/FileMappings/TypeScript/ModuleIndexFileMapping.js";
import { TestFileMapping } from "../../Project/FileMappings/TypeScript/TestFileMapping.js";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator.js";
import { TSModulePackageFileMapping } from "./FileMappings/NPMPackaging/TSModulePackageFileMapping.js";

const { whiteBright } = chalk;

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
            new class extends TestFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return join(self.SourceRoot, "tests", "main.test.ts");
                }

                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The context of the file-mapping.
                 */
                public override async Context(): Promise<ISuiteContext>
                {
                    return {
                        SuiteName: this.Generator.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            }(this),
            {
                Source: () => this.commonTemplatePath(`${readmeFileName}.ejs`),
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
