import { createRequire } from "module";
import { EOL } from "os";
import { relative } from "path";
import { Generator, Question, IComponentCollection, IFileMapping, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import chalk = require("chalk");
import JSON = require("comment-json");
import dedent = require("dedent");
import { split } from "eol";
import { ESLint } from "eslint";
import { readFile, writeJSON, readJSON } from "fs-extra";
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { Linter } from "tslint";
import { Program } from "typescript";
import { join, resolve } from "upath";
import { GeneratorOptions } from "yeoman-generator";
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
 * Provides the functionality to generate a project writtein in TypeScript.
 */
export class TSProjectGenerator<T extends ITSProjectSettings = ITSProjectSettings> extends Generator<T>
{
    /**
     * Initializes a new instance of the `TSProjectGenerator<T>` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: Record<string, unknown>)
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
            } as GeneratorOptions);
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
    protected get Questions(): Array<Question<T>>
    {
        return new TSProjectQuestionCollection(this).Questions;
    }

    /**
     * @inheritdoc
     */
    protected get Components(): IComponentCollection<T>
    {
        return new TSProjectComponentCollection(this);
    }

    /**
     * @inheritdoc
     */
    protected get FileMappings(): Array<IFileMapping<T>>
    {
        return [
            new TSProjectPackageFileMapping(this),
            {
                Source: this.modulePath(".gitignore"),
                Destination: ".gitignore"
            },
            new NPMIgnoreFileMapping(this),
            {
                Source: this.modulePath(".mocharc.jsonc"),
                Destination: ".mocharc.jsonc"
            },
            {
                Source: this.modulePath("tsconfig.base.json"),
                Destination: "tsconfig.base.json",
                Processor: async (fileMapping, generator) =>
                {
                    let tsConfig = JSON.parse((await readFile(await fileMapping.Source)).toString());
                    delete tsConfig.compilerOptions.declarationMap;
                    delete tsConfig.compilerOptions.baseUrl;
                    delete tsConfig.compilerOptions.paths;
                    delete tsConfig.compilerOptions.typeRoots;

                    generator.fs.write(await fileMapping.Destination, split(JSON.stringify(tsConfig, null, 4)).join(EOL));
                }
            },
            {
                Source: this.modulePath("tsconfig.json"),
                Destination: "tsconfig.json",
                Processor: async (target, generator) =>
                {
                    let tsConfig = JSON.parse((await readFile(await target.Source)).toString());

                    if (!this.Settings[GeneratorSettingKey.Components].includes(TSProjectComponent.Linting))
                    {
                        delete tsConfig.references;
                    }

                    generator.fs.write(await target.Destination, split(JSON.stringify(tsConfig, null, 4)).join(EOL));
                }
            }
        ];
    }

    /**
     * @inheritdoc
     */
    public async prompting(): Promise<void>
    {
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
            dedent(
                `Your workspace has been generated!

                ${chalk.whiteBright("Installing Dependencies…")}`));

        this.npmInstall();
    }

    /**
     * Cleans the workspace.
     */
    public async cleanup(): Promise<void>
    {
        let tempDir = new TempDirectory();
        let lintPackage = new Package(tempDir.MakePath("package.json"), {});
        let workspaceRequire: NodeRequire;
        let linterConstructor: typeof Linter;
        let eslintConstructor: typeof ESLint;
        let program: Program;
        let linter: ESLint;
        let tsConfigFile = tempDir.MakePath("tsconfig.json");
        let tsConfig = await readJSON(this.destinationPath("tsconfig.json"));
        this.log("");
        this.log(chalk.whiteBright("Cleaning up the TypeScript-Files…"));
        this.log(chalk.whiteBright("Creating a temporary linting-environment…"));
        delete tsConfig.extends;
        tsConfig.compilerOptions.rootDir = resolve(this.destinationPath(this.SourceRoot));
        tsConfig.include = [resolve(this.destinationPath(this.SourceRoot, "**", "*"))];
        await writeJSON(tsConfigFile, tsConfig);
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
                overrideConfigFile: join(__dirname, "..", "..", ".eslintrc.js"),
                overrideConfig: {
                    parserOptions: {
                        project: tsConfigFile
                    }
                }
            });

        for (let fileName of program.getRootFileNames())
        {
            this.log(chalk.gray(`Cleaning up "${relative(this.destinationPath(), fileName)}"…`));
            await ESLint.outputFixes(await linter.lintFiles(fileName));
        }

        tempDir.Dispose();
    }

    /**
     * @inheritdoc
     */
    public async end(): Promise<void>
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
