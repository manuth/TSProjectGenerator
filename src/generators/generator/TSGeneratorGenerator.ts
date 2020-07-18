import { createRequire } from "module";
import Path = require("path");
import { Generator, GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import chalk = require("chalk");
import JSON = require("comment-json");
import Dedent = require("dedent");
import { ESLint } from "eslint";
import FileSystem = require("fs-extra");
import CamelCase = require("lodash.camelcase");
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { Linter } from "tslint";
import { Program } from "typescript";
import YoSay = require("yosay");
import { SubGeneratorPrompt } from "../../Components/Inquiry/Prompts/SubGeneratorPrompt";
import { LintingComponent } from "../../Linting/Components/LintingComponent";
import { LintDependencies } from "../../NPMPackaging/Dependencies/LintDependencies";
import { PackageDependencyCollection } from "../../NPMPackaging/Dependencies/PackageDependencyCollection";
import { TSProjectDestinationQuestion } from "../../Project/Inquiry/TSProjectDestinationQuestion";
import { TSProjectDisplayNameQuestion } from "../../Project/Inquiry/TSProjectDisplayNameQuestion";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSGeneratorCodeWorkspace } from "./Components/TSGeneratorCodeWorkspace";
import { PackageFileMapping } from "./FileMappings/PackageFileMapping";
import { TSGeneratorDescriptionQuestion } from "./Inquiry/TSGeneratorDescriptionQuestion";
import { TSGeneratorModuleNameQuestion } from "./Inquiry/TSGeneratorModuleNameQuestion";
import { ITSGeneratorSettings } from "./Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "./Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "./Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./Settings/TSGeneratorSettingKey";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class TSGeneratorGenerator<T extends ITSGeneratorSettings = ITSGeneratorSettings> extends Generator<T>
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
        return "app";
    }

    /**
     * @inheritdoc
     */
    protected get Questions(): Array<Question<T>>
    {
        return [
            new TSProjectDestinationQuestion<T>(),
            new TSProjectDisplayNameQuestion<T>(),
            new TSGeneratorModuleNameQuestion<T>(),
            new TSGeneratorDescriptionQuestion<T>()
        ];
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<T>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        new LintingComponent(),
                        new TSGeneratorCodeWorkspace(),
                        {
                            ID: TSGeneratorComponent.GeneratorExample,
                            DisplayName: "Example Generator (recommended)",
                            DefaultEnabled: true,
                            FileMappings: (component, generator) => this.GetGeneratorFileMappings("app", generator.Settings[TSProjectSettingKey.DisplayName])
                        },
                        {
                            ID: TSGeneratorComponent.SubGeneratorExample,
                            DisplayName: "Example Sub-Generator",
                            FileMappings: (component, generator) => generator.Settings[TSGeneratorSettingKey.SubGenerator].flatMap(
                                (subGeneratorOptions) =>
                                {
                                    return this.GetGeneratorFileMappings(
                                        subGeneratorOptions[SubGeneratorSettingKey.Name],
                                        subGeneratorOptions[SubGeneratorSettingKey.DisplayName]);
                                }),
                            Questions: [
                                {
                                    type: SubGeneratorPrompt.TypeName,
                                    name: TSGeneratorSettingKey.SubGenerator,
                                    message: "Please specify the details of the sub-generators to create"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * @inheritdoc
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        return [
            new PackageFileMapping(this),
            {
                Source: ".gitignore.ejs",
                Destination: ".gitignore"
            },
            {
                Source: ".markdownlint.json",
                Destination: ".markdownlint.json"
            },
            {
                Source: ".npmignore.ejs",
                Destination: ".npmignore"
            },
            {
                Source: this.modulePath(".mocharc.jsonc"),
                Destination: ".mocharc.jsonc"
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
            },
            {
                Source: this.modulePath("tsconfig.base.json"),
                Destination: "tsconfig.base.json"
            },
            {
                Destination: "tsconfig.json",
                Processor: async (target) =>
                {
                    let tsConfig = await FileSystem.readJSON(this.modulePath("tsconfig.json"));

                    if (!this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
                    {
                        delete tsConfig.references;
                    }

                    this.fs.writeJSON(await target.Destination, tsConfig, null, 4);
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
        this.log(YoSay(`Welcome to the ${chalk.whiteBright("TypeScript Generator")} generator!`));
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public async writing(): Promise<void>
    {
        this.log(chalk.whiteBright("Generating the Workspace"));
        this.destinationRoot(this.Settings[TSProjectSettingKey.Destination]);
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public async install(): Promise<void>
    {
        this.log(
            Dedent(
                `Your workspace has been generated!

                ${chalk.whiteBright("Installing Dependencies...")}`));
        this.npmInstall();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
    {
        let tempDir = new TempDirectory();
        let lintPackage = new Package(tempDir.MakePath("package.json"), {});
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = this.destinationPath("tsconfig.json");
        let newTSConfigFile = this.destinationPath("tsconfig.temp.json");
        let tsConfig = JSON.parse((await FileSystem.readFile(tsConfigFile)).toString());
        this.log();
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));
        this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
        lintPackage.Register(new LintDependencies());

        lintPackage.Register(
            new PackageDependencyCollection(
                {
                    devDependencies: [
                        "typescript"
                    ]
                }));

        await FileSystem.writeJSON(lintPackage.FileName, lintPackage.ToJSON());

        await FileSystem.writeJSON(
            newTSConfigFile,
            {
                ...tsConfig,
                extends: undefined
            });

        this.spawnCommandSync(
            npmWhich(__dirname).sync("npm"),
            [
                "install",
                "--silent"
            ],
            {
                cwd: tempDir.FullName
            });

        workspaceRequire = createRequire(Path.join(tempDir.FullName, ".js"));
        linterConstructor = workspaceRequire("tslint").Linter;
        eslintConstructor = workspaceRequire("eslint").ESLint;
        program = linterConstructor.createProgram(newTSConfigFile);

        linter = new eslintConstructor(
            {
                cwd: tempDir.FullName,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: Path.join(__dirname, "..", "..", "..", ".eslintrc.js"),
                overrideConfig: {
                    parserOptions: {
                        project: newTSConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${Path.relative(this.destinationPath(), fileName)}"...`));
            await ESLint.outputFixes(await linter.lintFiles(fileName));
        }

        await FileSystem.remove(newTSConfigFile);

        this.log();
        this.log(Dedent(`
            ${chalk.whiteBright("Finished")}
            Your package "${this.Settings[TSProjectSettingKey.DisplayName]}" has been created!
            To start editing with Visual Studio Code use following command:

                code "${this.Settings[TSProjectSettingKey.Destination]}"

            Open "GettingStarted.md" in order to learn more about how to create your very own generator.
            Thanks for using TSGeneratorGenerator!`));
    }

    /**
     * Creates file-mappings for a generator.
     *
     * @param id
     * The id of the generator.
     *
     * @param displayName
     * The human readable name of the generator.
     *
     * @returns
     * File-mappings for a generator.
     */
    protected GetGeneratorFileMappings =
        (id: string, displayName: string): Array<IFileMapping<T>> =>
        {
            let name = (id.charAt(0).toUpperCase() + CamelCase(id).slice(1));
            let source = "generator";
            let destination = `src/generators/${id}`;
            let generatorName = `${name}Generator`;
            let identities = `${name}Setting`;
            let settings = `I${name}Settings`;

            return [
                {
                    Source: Path.join(source, "LicenseType.ts.ejs"),
                    Destination: Path.join(destination, "LicenseType.ts")
                },
                {
                    Source: Path.join(source, "Setting.ts.ejs"),
                    Context: () =>
                    {
                        return { Name: identities };
                    },
                    Destination: Path.join(destination, `${identities}.ts`)
                },
                {
                    Source: Path.join(source, "ISettings.ts.ejs"),
                    Context: () =>
                    {
                        return {
                            Name: generatorName,
                            SettingsInterface: settings,
                            Identities: identities
                        };
                    },
                    Destination: Path.join(destination, `${settings}.ts`)
                },
                {
                    Source: Path.join(source, "Generator.ts.ejs"),
                    Context: () =>
                    {
                        return {
                            Name: generatorName,
                            SettingsInterface: settings,
                            Identities: identities,
                            ID: id,
                            DisplayName: displayName
                        };
                    },
                    Destination: Path.join(destination, `${generatorName}.ts`)
                },
                {
                    Source: Path.join(source, "index.ts.ejs"),
                    Context: () =>
                    {
                        return {
                            Name: generatorName
                        };
                    },
                    Destination: Path.join(destination, "index.ts")
                },
                {
                    Source: Path.join(source, "templates"),
                    Destination: Path.join("templates", id)
                }
            ];
        };
}
