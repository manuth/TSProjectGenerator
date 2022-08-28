import { GeneratorOptions, GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import { whiteBright } from "chalk";
import dedent = require("dedent");
import { ensureDir } from "fs-extra";
import { join } from "upath";
import yosay = require("yosay");
import { SubGeneratorPrompt } from "../../Components/Inquiry/Prompts/SubGeneratorPrompt";
import { GeneratorName } from "../../Core/GeneratorName";
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackaging/TSProjectPackageFileMapping";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TSGeneratorComponentCollection } from "./Components/TSGeneratorComponentCollection";
import { TSGeneratorPackageFileMapping } from "./FileMappings/NPMPackaging/TSGeneratorPackageFileMapping";
import { GeneratorMainSuiteFileMapping } from "./FileMappings/TypeScript/GeneratorMainSuiteFileMapping";
import { GeneratorSuiteFileMapping } from "./FileMappings/TypeScript/GeneratorSuiteFileMapping";
import { NamingContext } from "./FileMappings/TypeScript/NamingContext";
import { TSGeneratorQuestionCollection } from "./Inquiry/TSGeneratorQuestionCollection";
import { ITSGeneratorSettings } from "./Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "./Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "./Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./Settings/TSGeneratorSettingKey";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorGenerator<TSettings extends ITSGeneratorSettings = ITSGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends TSProjectGenerator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`} class.
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
        this.env.adapter.promptModule.registerPrompt(SubGeneratorPrompt.TypeName, SubGeneratorPrompt);
    }

    /**
     * Gets the name of the `GettingStarted`-file.
     */
    protected get GettingStartedFileName(): string
    {
        return "GettingStarted.md";
    }

    /**
     * @inheritdoc
     */
    public override get TemplateRoot(): string
    {
        return GeneratorName.Generator;
    }

    /**
     * @inheritdoc
     */
    public override get Questions(): Array<Question<TSettings>>
    {
        return new TSGeneratorQuestionCollection(this).Questions;
    }

    /**
     * @inheritdoc
     */
    public override get Components(): IComponentCollection<TSettings, TOptions>
    {
        return new TSGeneratorComponentCollection(this);
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        let result: Array<IFileMapping<TSettings, TOptions>> = [];
        let readmeFileName = "README.md";

        let namingContext = new NamingContext(
            GeneratorName.Main,
            this.Settings[TSProjectSettingKey.DisplayName],
            this.SourceRoot);

        for (let fileMapping of super.FileMappings)
        {
            if (fileMapping instanceof TSProjectPackageFileMapping)
            {
                result.push(new TSGeneratorPackageFileMapping(this));
            }
            else
            {
                result.push(fileMapping);
            }
        }

        return [
            ...result,
            {
                Source: "GettingStarted.md.ejs",
                Destination: this.GettingStartedFileName,
                Context: () =>
                {
                    return {
                        ID: this.Settings[TSProjectSettingKey.Name].replace(/^generator-/, ""),
                        Name: this.Settings[TSProjectSettingKey.Name],
                        HasCodeWorkspace: this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.VSCode),
                        HasLinting: this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting),
                        HasGenerator: this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample),
                        SubGenerators: (this.Settings[TSGeneratorSettingKey.SubGenerators] ?? []).map(
                            (subGeneratorOptions) =>
                            {
                                let name = subGeneratorOptions[SubGeneratorSettingKey.Name];

                                return {
                                    Name: name,
                                    Path: join(this.SourceRoot, "generators", name)
                                };
                            })
                    };
                }
            },
            {
                Source: `${readmeFileName}.ejs`,
                Destination: readmeFileName,
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.Name],
                        DisplayName: this.Settings[TSProjectSettingKey.DisplayName],
                        Description: this.Settings[TSProjectSettingKey.Description]
                    };
                }
            },
            new GeneratorMainSuiteFileMapping<TSettings, TOptions>(this, namingContext),
            new GeneratorSuiteFileMapping<TSettings, TOptions>(this, namingContext),
            {
                Destination: join(this.SourceRoot, "generators"),
                Processor: (target) =>
                {
                    return ensureDir(target.Destination);
                }
            },
            {
                Destination: "templates",
                Processor: (target) =>
                {
                    return ensureDir(target.Destination);
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public override async prompting(): Promise<void>
    {
        this.log(yosay(`Welcome to the ${whiteBright.bold("TypeScript Generator")} generator!`));
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
                    Open "${this.GettingStartedFileName}" in order to learn more about how to create your very own generator.
                    Thanks for using TSGeneratorGenerator!`));
    }
}
