import { spawnSync } from "child_process";
import { createRequire } from "module";
import Path = require("path");
import { isNullOrUndefined } from "util";
import { Generator, GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import chalk = require("chalk");
import JSON = require("comment-json");
import Dedent = require("dedent");
import { ESLint } from "eslint";
import FileSystem = require("fs-extra");
import CamelCase = require("lodash.camelcase");
import KebabCase = require("lodash.kebabcase");
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { Linter } from "tslint";
import { Program } from "typescript";
import YoSay = require("yosay");
import { LintRuleset } from "../../Linting/LintRuleset";
import { CommonDependencies } from "../../NPMPackaging/CommonDependencies";
import { LintDependencies } from "../../NPMPackaging/LintDependencies";
import { TSProjectComponent } from "../../Project/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/TSProjectSettingKey";
import { SubGeneratorPrompt } from "../../Prompting/SubGeneratorPrompt";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "./ITSGeneratorSettings";
import { PackageFileMapping } from "./PackageFileMapping";
import { SubGeneratorSettingKey } from "./SubGeneratorSettingKey";
import { TSGeneratorComponent } from "./TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./TSGeneratorSettingKey";

/**
 * Provides the functionality to generate a generator written in TypeScript.
 */
export class TSGeneratorGenerator extends Generator<ITSGeneratorSettings>
{
    /**
     * Initializes a new instance of the `AppGenerator` class.
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
    protected get Questions(): Array<Question<ITSGeneratorSettings>>
    {
        return [
            {
                type: "input",
                name: TSProjectSettingKey.Destination,
                message: "Where do you want to save your generator to?",
                default: "./",
                filter: async input => Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input)
            },
            {
                type: "input",
                name: TSProjectSettingKey.DisplayName,
                message: "What's the name of your project?",
                default: (answers: ITSGeneratorSettings) => Path.basename(answers[TSProjectSettingKey.Destination]),
                validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
            },
            {
                type: "input",
                name: TSProjectSettingKey.Name,
                message: "What's the name of the node-module?",
                default: (answers: ITSGeneratorSettings) => "generator-" + KebabCase(answers[TSProjectSettingKey.DisplayName].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
                filter: input => KebabCase(input),
                validate: (input: string) =>
                {
                    if (/[\w-]+/.test(input))
                    {
                        return input.startsWith("generator-") ? true : 'The name must start with "generator-"';
                    }
                    else
                    {
                        return "Please provide a name according to the npm naming-conventions.";
                    }
                }
            },
            {
                type: "input",
                name: TSProjectSettingKey.Description,
                message: "Please enter a description for your generator.",
                default: async (settings: ITSGeneratorSettings) =>
                {
                    let npmPackage = new Package(Path.join(settings[TSProjectSettingKey.Destination], ".json"), {});
                    await npmPackage.Normalize();
                    return npmPackage.Description;
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<ITSGeneratorSettings>
    {
        return {
            Question: "What do you want to include in your workspace?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: TSProjectComponent.Linting,
                            DisplayName: "ESLint configurations",
                            DefaultEnabled: true,
                            Questions: [
                                {
                                    name: TSProjectSettingKey.LintRuleset,
                                    type: "list",
                                    message: "What ruleset do you want to use for linting?",
                                    choices: [
                                        {
                                            value: LintRuleset.Weak,
                                            name: "manuth's weak ruleset"
                                        },
                                        {
                                            value: LintRuleset.Recommended,
                                            name: "manuth's recommended ruleset"
                                        }
                                    ],
                                    default: LintRuleset.Recommended
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: ".eslintrc.js.ejs",
                                    Destination: ".eslintrc.js",
                                    Context: (fileMapping, generator) =>
                                    {
                                        let preset: string;

                                        switch (generator.Settings[TSProjectSettingKey.LintRuleset])
                                        {
                                            case LintRuleset.Weak:
                                                preset = "weak-requiring-type-checking";
                                                break;
                                            case LintRuleset.Recommended:
                                            default:
                                                preset = "recommended-requiring-type-checking";
                                                break;
                                        }

                                        return {
                                            preset
                                        };
                                    }
                                },
                                {
                                    Source: this.modulePath("tsconfig.eslint.json"),
                                    Destination: "tsconfig.eslint.json"
                                }
                            ]
                        },
                        {
                            ID: TSProjectComponent.VSCode,
                            DisplayName: "Visual Studio Code-Workspace",
                            DefaultEnabled: true,
                            FileMappings: [
                                {
                                    Source: this.modulePath(".vscode"),
                                    Destination: ".vscode"
                                },
                                {
                                    Source: this.modulePath(".vscode", "launch.json"),
                                    Destination: this.destinationPath(".vscode", "launch.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let configurations: any[] = [];
                                        let launch: ILaunchFile = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        let generators: string[] = [
                                            "app"
                                        ];

                                        if (!isNullOrUndefined(launch.configurations))
                                        {
                                            let validConfigurations: any[] = [];

                                            for (let configuration of launch.configurations)
                                            {
                                                if ((configuration.name as string).toLowerCase().includes("launch tests"))
                                                {
                                                    validConfigurations.push(configuration);
                                                }
                                            }

                                            launch.configurations = validConfigurations;
                                        }
                                        else
                                        {
                                            launch.configurations = [];
                                        }

                                        if (this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
                                        {
                                            for (let subGeneratorOptions of this.Settings[TSGeneratorSettingKey.SubGenerator] ?? [])
                                            {
                                                generators.push(subGeneratorOptions[SubGeneratorSettingKey.Name]);
                                            }
                                        }

                                        for (let generatorName of generators)
                                        {
                                            configurations.push(
                                                {
                                                    type: "node",
                                                    request: "launch",
                                                    name: generatorName === "app" ? "Launch Yeoman" : `Launch ${generatorName} generator`,
                                                    program: "${workspaceFolder}/node_modules/yo/lib/cli.js",
                                                    args: [
                                                        `\${workspaceFolder}/lib/generators/${generatorName}`
                                                    ],
                                                    console: "integratedTerminal",
                                                    internalConsoleOptions: "neverOpen",
                                                    preLaunchTask: "Build",
                                                    cwd: "${workspaceFolder}/..",
                                                    sourceMaps: true
                                                });
                                        }

                                        launch.configurations.unshift(...configurations);
                                        this.fs.write(await fileMapping.Destination, JSON.stringify(launch, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "settings.json"),
                                    Destination: this.destinationPath(".vscode", "settings.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let result: any = {};
                                        let settings = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        for (let key in settings)
                                        {
                                            if (key !== "files.associations")
                                            {
                                                result[key] = settings[key];
                                            }
                                        }

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(result, null, 4));
                                    }
                                },
                                {
                                    Source: this.modulePath(".vscode", "tasks.json"),
                                    Destination: this.destinationPath(".vscode", "tasks.json"),
                                    Processor: async (fileMapping) =>
                                    {
                                        let tasks = JSON.parse((await FileSystem.readFile(await fileMapping.Source)).toString());

                                        for (let task of tasks.tasks)
                                        {
                                            if (task.label === "Lint")
                                            {
                                                task.problemMatcher = task.problemMatcher[0];
                                            }
                                        }

                                        this.fs.write(await fileMapping.Destination, JSON.stringify(tasks, null, 4));
                                    }
                                }
                            ]
                        },
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
    protected get FileMappings(): Array<IFileMapping<ITSGeneratorSettings>>
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
        lintPackage.Register(new CommonDependencies());
        lintPackage.Register(new LintDependencies());
        await FileSystem.writeJSON(lintPackage.FileName, lintPackage.ToJSON());

        await FileSystem.writeJSON(
            newTSConfigFile,
            {
                ...tsConfig,
                extends: undefined
            });

        spawnSync(
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
        (id: string, displayName: string): Array<IFileMapping<ITSGeneratorSettings>> =>
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
