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
import { Constants } from "../../Core/Constants";
import { LintRuleset } from "../../Linting/LintRuleset";
import { CommonDependencies } from "../../NPMPackaging/CommonDependencies";
import { GeneratorDependencies } from "../../NPMPackaging/GeneratorDependencies";
import { IScriptMapping } from "../../NPMPackaging/IScriptMapping";
import { LintDependencies } from "../../NPMPackaging/LintDependencies";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "./ITSGeneratorSettings";
import { SubGeneratorSetting } from "./SubGeneratorSetting";
import { TSGeneratorComponent } from "./TSGeneratorComponent";
import { TSGeneratorSettingKey } from "./TSGeneratorSetting";

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
                name: TSGeneratorSettingKey.Destination,
                message: "Where do you want to save your generator to?",
                default: "./",
                filter: async input => Path.isAbsolute(input) ? input : Path.resolve(process.cwd(), input)
            },
            {
                type: "input",
                name: TSGeneratorSettingKey.DisplayName,
                message: "What's the name of your project?",
                default: (answers: ITSGeneratorSettings) => Path.basename(answers[TSGeneratorSettingKey.Destination]),
                validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
            },
            {
                type: "input",
                name: TSGeneratorSettingKey.Name,
                message: "What's the name of the node-module?",
                default: (answers: ITSGeneratorSettings) => "generator-" + KebabCase(answers[TSGeneratorSettingKey.DisplayName].replace(/(generator-)?(.*?)(generator)?$/i, "$2")),
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
                name: TSGeneratorSettingKey.Description,
                message: "Please enter a description for your generator.",
                default: async (settings: ITSGeneratorSettings) =>
                {
                    let npmPackage = new Package(Path.join(settings[TSGeneratorSettingKey.Destination], ".json"), {});
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
                            ID: TSGeneratorComponent.Linting,
                            DisplayName: "ESLint configurations",
                            DefaultEnabled: true,
                            Questions: [
                                {
                                    name: TSGeneratorSettingKey.LintRuleset,
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

                                        switch (generator.Settings[TSGeneratorSettingKey.LintRuleset])
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
                            ID: TSGeneratorComponent.VSCode,
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
                                            generators.push(this.Settings[TSGeneratorSettingKey.SubGenerator][SubGeneratorSetting.Name]);
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
                                }
                            ]
                        },
                        {
                            ID: TSGeneratorComponent.GeneratorExample,
                            DisplayName: "Example Generator (recommended)",
                            DefaultEnabled: true,
                            FileMappings: (fileMapping, generator) => this.GetGeneratorFileMappings("app", generator.Settings[TSGeneratorSettingKey.DisplayName])
                        },
                        {
                            ID: TSGeneratorComponent.SubGeneratorExample,
                            DisplayName: "Example Sub-Generator",
                            FileMappings: (fileMapping, generator) => this.GetGeneratorFileMappings(
                                generator.Settings[TSGeneratorSettingKey.SubGenerator][SubGeneratorSetting.Name],
                                generator.Settings[TSGeneratorSettingKey.SubGenerator][SubGeneratorSetting.DisplayName]),
                            Questions: [
                                {
                                    type: "input",
                                    name: `${TSGeneratorSettingKey.SubGenerator}.${SubGeneratorSetting.DisplayName}`,
                                    message: "What's the human-readable name of your sub-generator?",
                                    validate: (input: string) => /.+/.test(input.trim()) ? true : "The name must not be empty!"
                                },
                                {
                                    type: "input",
                                    name: `${TSGeneratorSettingKey.SubGenerator}.${SubGeneratorSetting.Name}`,
                                    message: "What's the unique name of the sub-generator?",
                                    default: (settings: ITSGeneratorSettings) => KebabCase(settings[TSGeneratorSettingKey.SubGenerator][SubGeneratorSetting.DisplayName] || ""),
                                    validate: (input: string) => /[\w-]+/.test(input) ? true : "Please provide a name according to the npm naming-conventions."
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
        this.destinationRoot(this.Settings[TSGeneratorSettingKey.Destination]);

        let sourceRoot = "src";
        let npmPackage = await this.GetPackageJSON();
        this.fs.writeJSON(npmPackage.FileName, npmPackage.ToJSON());
        this.fs.copy(this.templatePath(".gitignore.ejs"), this.destinationPath(".gitignore"));
        this.fs.copy(this.templatePath(".markdownlint.json"), this.destinationPath(".markdownlint.json"));
        this.fs.copy(this.templatePath(".npmignore.ejs"), this.destinationPath(".npmignore"));
        this.fs.copy(this.modulePath(".mocharc.jsonc"), this.destinationPath(".mocharc.jsonc"));
        this.fs.copyTpl(
            this.templatePath("GettingStarted.md.ejs"),
            this.destinationPath("GettingStarted.md"),
            {
                ID: this.Settings[TSGeneratorSettingKey.Name].replace(/^generator-/, ""),
                Name: this.Settings[TSGeneratorSettingKey.Name],
                HasCodeWorkspace: this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.VSCode),
                HasLinting: this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.Linting),
                HasGenerator: this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample),
                HasSubGenerator: this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample),
                SubGeneratorName: this.Settings[TSGeneratorSettingKey.SubGenerator]?.[SubGeneratorSetting.Name] ?? null,
                SubGeneratorPath: Path.join(sourceRoot, "generators", this.Settings[TSGeneratorSettingKey.SubGenerator]?.[SubGeneratorSetting.Name] ?? "")
            });
        this.fs.copyTpl(
            this.templatePath("README.md.ejs"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings[TSGeneratorSettingKey.Name],
                DisplayName: this.Settings[TSGeneratorSettingKey.DisplayName],
                Description: this.Settings[TSGeneratorSettingKey.Description]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "main.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "main.test.ts"),
            {
                Name: this.Settings[TSGeneratorSettingKey.DisplayName]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "index.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", "index.test.ts"),
            {
                Name: this.Settings[TSGeneratorSettingKey.Name]
            });
        this.fs.copyTpl(
            this.templatePath("tests", "Generators", "app.test.ts.ejs"),
            this.destinationPath(sourceRoot, "tests", "Generators", `${this.Settings[TSGeneratorSettingKey.Name]}.test.ts`),
            {
                Name: this.Settings[TSGeneratorSettingKey.DisplayName]
            });
        FileSystem.ensureDir(this.destinationPath(sourceRoot, "generators"));
        FileSystem.ensureDir(this.destinationPath("templates"));

        let tsConfig = await FileSystem.readJSON(this.modulePath("tsconfig.json"));

        if (!this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.Linting))
        {
            delete tsConfig.references;
        }

        this.fs.copy(this.modulePath("tsconfig.base.json"), this.destinationPath("tsconfig.base.json"));
        this.fs.writeJSON(this.destinationPath("tsconfig.json"), tsConfig, null, 4);
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
        let tempDir: TempDirectory;
        let workspaceRoot: string;
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = this.destinationPath("tsconfig.json");

        this.log();
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));

        if (!this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.Linting))
        {
            this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
            tempDir = new TempDirectory();
            let npmPackage = new Package(tempDir.MakePath("package.json"), {});
            npmPackage.Register(new LintDependencies());

            spawnSync(
                npmWhich(__dirname).sync("npm"),
                [
                    "install",
                    "--slient"
                ],
                {
                    cwd: tempDir.FullName
                });

            workspaceRoot = tempDir.FullName;
        }
        else
        {
            workspaceRoot = this.destinationPath();
        }

        workspaceRequire = createRequire(Path.join(workspaceRoot, ".js"));
        linterConstructor = workspaceRequire("tslint").Linter;
        eslintConstructor = workspaceRequire("eslint").ESLint;
        program = linterConstructor.createProgram(tsConfigFile);

        linter = new eslintConstructor(
            {
                cwd: workspaceRoot,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: Path.join(__dirname, "..", "..", "..", ".eslintrc.js"),
                overrideConfig: {
                    parserOptions: {
                        project: tsConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${Path.relative(this.destinationPath(), fileName)}"...`));
            await ESLint.outputFixes(await linter.lintFiles(fileName));
        }

        this.log();
        this.log(Dedent(`
            ${chalk.whiteBright("Finished")}
            Your package "${this.Settings[TSGeneratorSettingKey.DisplayName]}" has been created!
            To start editing with Visual Studio Code use following command:

                code "${this.Settings[TSGeneratorSettingKey.Destination]}"

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

    /**
     * Gets the package-manifest for the generator to generate.
     *
     * @returns
     * The `package.json`-metadata.
     */
    protected GetPackageJSON =
        async (): Promise<Package> =>
        {
            let result: Package;
            let fileName = this.destinationPath("package.json");

            if (await FileSystem.pathExists(fileName))
            {
                result = new Package(fileName);
            }
            else
            {
                result = new Package(
                    fileName,
                    {
                        name: this.Settings[TSGeneratorSettingKey.Name],
                        version: "0.0.0",
                        description: this.Settings[TSGeneratorSettingKey.Description],
                        author: {
                            name: this.user.git.name(),
                            email: this.user.git.email()
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

            if (this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.Linting))
            {
                result.Register(new LintDependencies(), true);
            }

            if (
                this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.GeneratorExample) ||
                this.Settings[GeneratorSettingKey.Components].includes(TSGeneratorComponent.SubGeneratorExample))
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
        };
}
