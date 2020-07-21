import Path = require("path");
import { GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import chalk = require("chalk");
import dedent = require("dedent");
import FileSystem = require("fs-extra");
import YoSay = require("yosay");
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
export class TSGeneratorGenerator<T extends ITSGeneratorSettings = ITSGeneratorSettings> extends TSProjectGenerator<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorGenerator<T>` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: Record<string, unknown>)
    {
        super(args, options);
        this.env.adapter.promptModule.registerPrompt(SubGeneratorPrompt.TypeName, SubGeneratorPrompt);
    }

    /**
     * Gets the path to the directory for the source-files.
     */
    protected get SourceRoot(): string
    {
        return "src";
    }

    /**
     * @inheritdoc
     */
    protected get TemplateRoot(): string
    {
        return "generator";
    }

    /**
     * @inheritdoc
     */
    protected get Questions(): Array<Question<T>>
    {
        return new TSGeneratorQuestionCollection().Questions;
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<T>
    {
        return new TSGeneratorComponentCollection(this);
    }

    /**
     * @inheritdoc
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        let result: Array<IFileMapping<T>> = [];

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
                Source: ".markdownlint.json",
                Destination: ".markdownlint.json"
            },
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
                        SubGenerators: (this.Settings[TSGeneratorSettingKey.SubGenerator] ?? []).map(
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
                Processor: async (target) =>
                {
                    return FileSystem.ensureDir(await target.Destination);
                }
            },
            {
                Destination: "templates",
                Processor: async (target) =>
                {
                    return FileSystem.ensureDir(await target.Destination);
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        this.log(YoSay(`Welcome to the ${chalk.whiteBright.bold("TypeScript Generator")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        return super.install();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        await super.end();

        this.log();

        this.log(
            dedent(
                `
                    Open "GettingStarted.md" in order to learn more about how to create your very own generator.
                    Thanks for using TSGeneratorGenerator!`));
    }
}
