import path from "node:path";
import { ReadLine } from "node:readline";
import chalk from "chalk";
import { Answers } from "inquirer";
import InputPrompt from "inquirer/lib/prompts/input.js";
import upath from "upath";
import { IPathPromptRootDescriptor } from "./IPathPromptRootDescriptor.js";
import { IPathQuestion } from "./IPathQuestion.js";
import { IPathQuestionOptions } from "./IPathQuestionOptions.js";
import { PromptCallback } from "./PromptCallback.js";

const { dim } = chalk;
const { join, normalize, relative } = upath;

declare module "inquirer"
{
    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface QuestionMap<T>
    {
        /**
         * Represents the path-prompt.
         */
        [PathPrompt.TypeName]: IPathQuestion<T>;
    }
}

/**
 * Provides the functionality to ask for a path.
 *
 * @template T
 * The type of the prompt-options.
 */
export class PathPrompt<T extends IPathQuestionOptions = IPathQuestionOptions> extends InputPrompt<T>
{
    /**
     * The name of this prompt-type.
     */
    public static readonly TypeName = "project-path";

    /**
     * A value indicating whether the prompt has been initialized.
     */
    private initialized = false;

    /**
     * Resolves the initialization-process.
     */
    private initializationResolver: () => void;

    /**
     * Represents the initialization-process.
     */
    private initialization: Promise<void>;

    /**
     * A value indicating whether the initial user-input is being performed.
     */
    private initialInput = true;

    /**
     * The directory used to resolve relative paths for the {@link IPathQuestionOptions.default `default`} value and the answer.
     */
    private rootDir: string = null;

    /**
     * A value indicating whether paths outside the {@link PathPrompt.rootDir `rootDir`} are allowed.
     */
    private allowOutside = true;

    /**
     * Initializes a new instance of the {@link PathPrompt `PathPrompt<TAnswers, TQuestion>`}-class.
     *
     * @param question
     * The question to prompt the user to answer.
     *
     * @param readLine
     * An object for performing read from and write to the console.
     *
     * @param answers
     * The answer-hash.
     */
    public constructor(question: T, readLine: ReadLine, answers: Answers)
    {
        super(
            {
                ...question,
                validate: (input, answers) =>
                {
                    let result = this.ValidatePath(input);

                    if (
                        result === true &&
                        question.validate)
                    {
                        return question.validate(input, answers);
                    }
                    else
                    {
                        return result;
                    }
                }
            },
            readLine,
            answers);

        this.initialization = new Promise((resolve) => this.initializationResolver = resolve);
    }

    /**
     * Gets a component for handling file-system paths.
     */
    protected get Path(): path.PlatformPath
    {
        return this.opt.path ?? path;
    }

    /**
     * Gets a {@link Promise `Promise`} which represents the initialization-process.
     */
    public get Initialization(): Promise<void>
    {
        return this.initialization;
    }

    /**
     * Gets a value indicating whether the prompt has been initialized.
     */
    protected get Initialized(): boolean
    {
        return this.initialized;
    }

    /**
     * Gets a value indicating whether the initial user-input is being performed.
     */
    protected get InitialInput(): boolean
    {
        return this.initialInput;
    }

    /**
     * Gets or sets the directory used to resolve relative paths for the {@link IPathQuestionOptions.default `default`} value and the answer.
     */
    protected get RootDir(): string
    {
        return this.rootDir;
    }

    /**
     * @inheritdoc
     */
    protected set RootDir(value: string)
    {
        this.rootDir = value;
    }

    /**
     * Gets or sets a value indicating whether paths outside the {@link PathPrompt.RootDir `RootDir`} are allowed.
     */
    protected get AllowOutside(): boolean
    {
        return this.allowOutside;
    }

    /**
     * @inheritdoc
     */
    protected set AllowOutside(value: boolean)
    {
        this.allowOutside = value;
    }

    /**
     * Runs the prompt.
     *
     * @param callback
     * The callback for resolving the result.
     */
    protected override async _run(callback: PromptCallback): Promise<void>
    {
        super._run(callback);
        await this.Initialize();
    }

    /**
     * Initializes the prompt.
     */
    protected async Initialize(): Promise<void>
    {
        let rootDir: IPathPromptRootDescriptor | string;

        if (typeof this.opt.rootDir === "function")
        {
            rootDir = await this.opt.rootDir(this.answers);
        }
        else
        {
            rootDir = await this.opt.rootDir;
        }

        if (rootDir)
        {
            if (typeof rootDir === "string")
            {
                this.RootDir = rootDir;
            }
            else
            {
                this.RootDir = rootDir.path;
                this.AllowOutside = rootDir.allowOutside ?? true;
            }

            this.RootDir = normalize(this.RootDir);
        }

        if (this.opt.default)
        {
            if (
                this.RootDir &&
                !this.Path.isAbsolute(this.opt.default))
            {
                this.opt.default = join(this.RootDir, this.opt.default);
            }

            this.opt.default = this.Path.normalize(this.opt.default);
        }

        this.render(undefined);
        this.OnInitialized();
    }

    /**
     * Renders the prompt.
     *
     * @param error
     * The last error that occurred.
     */
    protected override render(error?: any): void
    {
        if (this.Initialized)
        {
            this.ProcessAnswer();
        }

        super.render(error);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The question-string.
     */
    protected override getQuestion(): string
    {
        let message = super.getQuestion();

        if (!this.Initialized && this.RootDir)
        {
            message += `${dim(this.Path.normalize(join(this.RootDir, "./")))}`;
        }

        return message;
    }

    /**
     * Processes the answer provided by the user.
     */
    protected ProcessAnswer(): void
    {
        let result: string;
        let answer = this.rl.line;
        let parsedPath = this.Path.parse(answer);
        let pathTree: string[] = [];

        if (
            this.InitialInput &&
            this.RootDir)
        {
            pathTree.push(this.Path.normalize(normalize(this.RootDir)));
            this.OnInitialInputPerformed();
        }
        else if (/^\.[/\\]/.test(answer))
        {
            pathTree.push(".");
        }

        if (/[/\\]$/.test(answer))
        {
            parsedPath = this.Path.parse(normalize(answer) + ".");
            parsedPath.base = "";
            parsedPath.name = "";
        }

        if (normalize(parsedPath.dir) !== ".")
        {
            pathTree.push(this.Path.normalize(normalize(parsedPath.dir)));
        }

        if (normalize(parsedPath.base) !== ".")
        {
            parsedPath.base = this.Path.normalize(normalize(parsedPath.base));
        }

        if (
            parsedPath.root.length > 0 &&
            (
                parsedPath.root === parsedPath.dir ||
                parsedPath.root === normalize(parsedPath.dir)))
        {
            if (parsedPath.base.length === 0)
            {
                result = this.Path.parse(this.Path.normalize(normalize(parsedPath.root))).root;
            }
            else
            {
                result = [this.Path.normalize(normalize(parsedPath.root)), parsedPath.base].join("");
            }
        }
        else
        {
            result = [...pathTree, parsedPath.base].join(this.Path.sep);
        }

        if (answer !== result)
        {
            this.ClearLine();
            this.rl.write(result);
        }
    }

    /**
     * Clears the content of the current line.
     */
    protected ClearLine(): void
    {
        this.rl.write(
            "",
            {
                ctrl: true,
                shift: true,
                name: "backspace"
            });

        this.rl.write(
            "",
            {
                ctrl: true,
                shift: true,
                name: "delete"
            });
    }

    /**
     * Handles the initialization of the prompt.
     */
    protected OnInitialized(): void
    {
        this.initialized = true;
        this.initializationResolver();
    }

    /**
     * Handles the initial input made to the prompt.
     */
    protected OnInitialInputPerformed(): void
    {
        this.initialInput = false;
    }

    /**
     * @inheritdoc
     *
     * @param input
     * The input to filter.
     *
     * @returns
     * The filtered input.
     */
    protected override filterInput(input: string): string
    {
        this.OnInitialInputPerformed();
        return super.filterInput(input);
    }

    /**
     * Validates the specified {@link path `path`}.
     *
     * @param path
     * The path to validate.
     *
     * @returns
     * Either a {@link Boolean `boolean`} indicating whether an error occurred or a {@link String `string`} describing an error.
     */
    protected ValidatePath(path: string): boolean | string
    {
        if (this.AllowOutside)
        {
            return true;
        }
        else
        {
            let relativePath = relative(this.RootDir, path);

            return (
                normalize(path).startsWith(join(this.RootDir, "./")) &&
                !relativePath.startsWith("../") &&
                relativePath !== ".." &&
                relativePath.length > 0) ?
                true :
                `Paths outside of \`${this.Path.normalize(this.RootDir)}\` are not allowed!`;
        }
    }
}
