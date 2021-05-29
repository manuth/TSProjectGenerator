import Path = require("path");
import { GeneratorOptions, GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import chalk = require("chalk");
import dedent = require("dedent");
import { ensureDir } from "fs-extra";
import yosay = require("yosay");
import { SubGeneratorPrompt } from "../../Components/Inquiry/Prompts/SubGeneratorPrompt";
import { TSProjectPackageFileMapping } from "../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TSGeneratorComponentCollection } from "./Components/TSGeneratorComponentCollection";
import { TSGeneratorPackageFileMapping } from "./FileMappings/NPMPackaging/TSGeneratorPackageFileMapping";
import { TSGeneratorQuestionCollection } from "./Inquiry/TSGeneratorQuestionCollection";
import { ITSGeneratorSettings } from "./Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "./Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "./Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./Settings/TSGeneratorSettingKey";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class TSGeneratorGenerator<TSettings extends ITSGeneratorSettings = ITSGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends TSProjectGenerator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorGenerator` class.
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
     * @inheritdoc
     */
    public override get TemplateRoot(): string
    {
        return "generator";
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
                Destination: "GettingStarted.md",
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
                                    Path: Path.join(this.SourceRoot, "generators", name)
                                };
                            })
                    };
                }
            },
            {
                Source: "README.md.ejs",
                Destination: "README.md",
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.Name],
                        DisplayName: this.Settings[TSProjectSettingKey.DisplayName],
                        Description: this.Settings[TSProjectSettingKey.Description]
                    };
                }
            },
            {
                Source: Path.join("tests", "main.test.ts.ejs"),
                Destination: Path.join(this.SourceRoot, "tests", "main.test.ts"),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            },
            {
                Source: Path.join("tests", "Generators", "index.test.ts.ejs"),
                Destination: Path.join(this.SourceRoot, "tests", "Generators", "index.test.ts"),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.Name]
                    };
                }
            },
            {
                Source: Path.join("tests", "Generators", "app.test.ts.ejs"),
                Destination: Path.join(this.SourceRoot, "tests", "Generators", `${this.Settings[TSProjectSettingKey.Name]}.test.ts`),
                Context: () =>
                {
                    return {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    };
                }
            },
            {
                Destination: Path.join(this.SourceRoot, "generators"),
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
        this.log(yosay(`Welcome to the ${chalk.whiteBright.bold("TypeScript Generator")} generator!`));
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
                    Open "GettingStarted.md" in order to learn more about how to create your very own generator.
                    Thanks for using TSGeneratorGenerator!`));
    }
}
