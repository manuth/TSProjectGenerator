import { createRequire } from "module";
import { relative } from "path";
import { Generator, GeneratorOptions, GeneratorSettingKey, IComponentCollection, IFileMapping, Question } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TempDirectory } from "@manuth/temp-files";
import chalk = require("chalk");
import dedent = require("dedent");
// eslint-disable-next-line node/no-unpublished-import
import type { ESLint } from "eslint";
import { readFile, readJSON, writeFile, writeJSON } from "fs-extra";
import npmWhich = require("npm-which");
// eslint-disable-next-line node/no-unpublished-import
import type { Linter } from "tslint";
import { fileName as eslintFileName } from "types-eslintrc";
import { fileName, Plugin, References, TSConfigJSON } from "types-tsconfig";
// eslint-disable-next-line node/no-unpublished-import
import type { Program } from "typescript";
import { changeExt, join, resolve } from "upath";
import { PathPrompt } from "../Components/Inquiry/Prompts/PathPrompt";
import { TSConfigFileMapping } from "../Components/Transformation/TSConfigFileMapping";
import { BuildDependencies } from "../NPMPackaging/Dependencies/BuildDependencies";
import { LintEssentials } from "../NPMPackaging/Dependencies/LintEssentials";
import { TSProjectComponentCollection } from "./Components/TSProjectComponentCollection";
import { NPMIgnoreFileMapping } from "./FileMappings/NPMIgnoreFileMapping";
import { TSProjectPackageFileMapping } from "./FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { TSProjectQuestionCollection } from "./Inquiry/TSProjectQuestionCollection";
import { ITSProjectSettings } from "./Settings/ITSProjectSettings";
import { TSProjectComponent } from "./Settings/TSProjectComponent";
import { TSProjectSettingKey } from "./Settings/TSProjectSettingKey";

/**
 * Provides the functionality to generate a project written in in TypeScript.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectGenerator<TSettings extends ITSProjectSettings = ITSProjectSettings, TOptions extends GeneratorOptions = GeneratorOptions> extends Generator<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`} class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: TOptions)
    {
        super(
            args,
            {
                ...options,
                customPriorities: [
                    ...(options.customPriorities as any[] ?? []),
                    {
                        before: "end",
                        priorityName: "cleanup"
                    }
                ]
            });

        this.env.adapter.promptModule.registerPrompt(PathPrompt.TypeName, PathPrompt);
    }

    /**
     * Gets the path to the directory for the source-files.
     */
    public get SourceRoot(): string
    {
        return "src";
    }

    /**
     * @inheritdoc
     */
    public override get Questions(): Array<Question<TSettings>>
    {
        return new TSProjectQuestionCollection(this).Questions;
    }

    /**
     * @inheritdoc
     */
    public override get Components(): IComponentCollection<TSettings, TOptions>
    {
        return new TSProjectComponentCollection(this);
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        let self = this;
        let changeLogFileName = "CHANGELOG.md";
        let gitIgnoreFileName = ".gitignore";
        let mochaConfigFileName = ".mocharc.jsonc";

        return [
            {
                Source: this.commonTemplatePath(`${changeLogFileName}.ejs`),
                Destination: changeLogFileName,
                Context: () => (
                    {
                        Name: this.Settings[TSProjectSettingKey.DisplayName]
                    })
            },
            new TSProjectPackageFileMapping(this),
            {
                Source: this.commonTemplatePath(`${gitIgnoreFileName}.ejs`),
                Destination: gitIgnoreFileName
            },
            new NPMIgnoreFileMapping(this),
            {
                Source: this.modulePath(mochaConfigFileName),
                Destination: mochaConfigFileName
            },
            new class extends TSConfigFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return this.Generator.modulePath(super.Source);
                }

                /**
                 * @inheritdoc
                 */
                public override get MiddleExtension(): string
                {
                    return "base";
                }

                /**
                 * @inheritdoc
                 *
                 * @param tsConfig
                 * The typescript-configuration to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(tsConfig: TSConfigJSON): Promise<TSConfigJSON>
                {
                    tsConfig = await super.Transform(tsConfig);
                    let plugins: Plugin[] = [];
                    delete tsConfig.compilerOptions.declarationMap;
                    delete tsConfig.compilerOptions.paths;

                    for (let [i] of tsConfig.compilerOptions.plugins.entries())
                    {
                        let plugin = tsConfig.compilerOptions.plugins[i];

                        if (plugin.transform !== "ts-nameof")
                        {
                            plugins.push(plugin);
                        }
                    }

                    tsConfig.compilerOptions.plugins = plugins;
                    return tsConfig;
                }
            }(this),
            new class extends TSConfigFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return this.Generator.modulePath(super.Source);
                }

                /**
                 * @inheritdoc
                 *
                 * @param tsConfig
                 * The typescript-configuration to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(tsConfig: TSConfigJSON): Promise<TSConfigJSON>
                {
                    tsConfig = await super.Transform(tsConfig);

                    if (!this.Generator.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
                    {
                        delete tsConfig.references;
                    }

                    return tsConfig;
                }
            }(this),
            new class extends TSConfigFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get MiddleExtension(): string
                {
                    return "build";
                }

                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return this.Generator.modulePath(super.Source);
                }
            }(this),
            new class extends TSConfigFileMapping<TSettings, TOptions>
            {
                /**
                 * @inheritdoc
                 */
                public override get BaseName(): string
                {
                    return join(self.SourceRoot, "tests", super.BaseName);
                }

                /**
                 * @inheritdoc
                 */
                public override get Source(): string
                {
                    return this.Generator.modulePath(super.Source);
                }

                /**
                 * @inheritdoc
                 *
                 * @param tsConfig
                 * The typescript-configuration to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(tsConfig: TSConfigJSON): Promise<TSConfigJSON>
                {
                    let references: References[] = [];
                    tsConfig = await super.Transform(tsConfig);

                    for (let reference of tsConfig.references)
                    {
                        if (reference.path === join("..", ".."))
                        {
                            references.push(reference);
                        }
                    }

                    tsConfig.references = references;
                    return tsConfig;
                }
            }(this)
        ];
    }

    /**
     * @inheritdoc
     */
    public override async prompting(): Promise<void>
    {
        return super.prompting();
    }

    /**
     * @inheritdoc
     */
    public override async writing(): Promise<void>
    {
        this.log(chalk.whiteBright("Generating the Workspace"));
        this.destinationRoot(this.Settings[TSProjectSettingKey.Destination]);
        return super.writing();
    }

    /**
     * @inheritdoc
     */
    public override async install(): Promise<void>
    {
        this.log("Your workspace has been generated!");
        super.install();
    }

    /**
     * Cleans the workspace.
     */
    public async cleanup(): Promise<void>
    {
        let tempDir = new TempDirectory();
        let esLintJSFileName = changeExt(eslintFileName, ".js");
        let lintPackage = new Package(tempDir.MakePath(Package.FileName), {});
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = tempDir.MakePath(fileName);
        let tsConfig = await readJSON(this.destinationPath(fileName));
        this.log("");
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));
        this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
        delete tsConfig.extends;
        tsConfig.compilerOptions.rootDir = resolve(this.destinationPath(this.SourceRoot));
        tsConfig.include = [resolve(this.destinationPath(this.SourceRoot, "**", "*"))];
        await writeJSON(tsConfigFile, tsConfig);
        await writeFile(tempDir.MakePath(esLintJSFileName), await readFile(this.modulePath(esLintJSFileName)));
        lintPackage.Register(new BuildDependencies());
        lintPackage.Register(new LintEssentials());
        await writeJSON(lintPackage.FileName, lintPackage.ToJSON());

        this.spawnCommandSync(
            npmWhich(__dirname).sync("npm"),
            [
                "install",
                "--silent"
            ],
            {
                cwd: tempDir.FullName
            });

        workspaceRequire = createRequire(join(tempDir.FullName, ".js"));
        linterConstructor = workspaceRequire("tslint").Linter;
        eslintConstructor = workspaceRequire("eslint").ESLint;
        program = linterConstructor.createProgram(tsConfigFile);

        linter = new eslintConstructor(
            {
                cwd: tempDir.FullName,
                fix: true,
                useEslintrc: false,
                overrideConfigFile: tempDir.MakePath(esLintJSFileName),
                overrideConfig: {
                    parserOptions: {
                        project: tsConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${relative(this.destinationPath(), fileName)}"…`));
            await eslintConstructor.outputFixes(await linter.lintFiles(fileName));
        }

        tempDir.Dispose();
    }

    /**
     * @inheritdoc
     */
    public override async end(): Promise<void>
    {
        this.log("");

        this.log(
            dedent(
                `
                    ${chalk.whiteBright("Finished!")}
                    Your package "${this.Settings[TSProjectSettingKey.DisplayName]}" has been created!
                    To start editing with Visual Studio Code use the following command:

                        code "${this.Settings[TSProjectSettingKey.Destination]}"`));
    }
}
