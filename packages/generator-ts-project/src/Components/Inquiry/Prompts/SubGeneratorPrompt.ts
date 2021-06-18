import { EOL } from "os";
import { ReadLine } from "readline";
import { Answers, ConfirmQuestionOptions, DistinctQuestion, prompt } from "inquirer";
import Prompt = require("inquirer/lib/prompts/base");
import kebabCase = require("lodash.kebabcase");
import { ISubGenerator } from "../../../generators/generator/Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey";
import { PromptCallback } from "./PromptCallback";

declare module "inquirer"
{
    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface QuestionMap<T>
    {
        /**
         * Represents the sub-generators prompt.
         */
        [SubGeneratorPrompt.TypeName]: ISubGeneratorQuestion<T>;
    }
}

/**
 * Provides options for the `SubGeneratorPrompt`.
 */
interface ISubGeneratorQuestionOptions<T extends Answers = Answers> extends ConfirmQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    default?: null;

    /**
     * Gets or sets a value indicating whether the prompt to repeat the questions should be answered with `yes` by default.
     */
    defaultRepeat?: boolean;
}

/**
 * Provides options for the `SubGeneratorPrompt`.
 */
interface ISubGeneratorQuestion<T extends Answers = Answers> extends ISubGeneratorQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    type: typeof SubGeneratorPrompt.TypeName;
}

/**
 * Provides a prompt for asking for sub-generators.
 */
export class SubGeneratorPrompt<T extends ITSGeneratorSettings> extends Prompt<ISubGeneratorQuestion<T>>
{
    /**
     * The name of the prompt-type.
     */
    public static readonly TypeName = "sub-generators";

    /**
     * The settings for the sub-generators.
     */
    private readonly subGeneratorSettings: ISubGenerator[] = [];

    /**
     * Initializes a new instance of the `SubGeneratorPrompt<T>` class.
     *
     * @param question
     * The options for the prompt.
     *
     * @param readLine
     * An object for performing read from and write to the console.
     *
     * @param answers
     * The answer-object.
     */
    public constructor(question: ISubGeneratorQuestion<T>, readLine: ReadLine, answers: T)
    {
        super(
            {
                validate: () => true,
                filter: (value: any) => value,
                when: () => true,
                ...question,
                default: null
            },
            readLine,
            answers);
    }

    /**
     * Gets the settings for the sub-generators.
     */
    protected get SubGeneratorSettings(): ISubGenerator[]
    {
        return this.subGeneratorSettings;
    }

    /**
     * Gets the questions to ask.
     */
    protected get Questions(): Array<DistinctQuestion<T>>
    {
        return [
            {
                name: SubGeneratorSettingKey.DisplayName,
                message: "What's the human-readable name of the sub-generator?",
                validate:(input: string) =>
                {
                    if (
                        this.SubGeneratorSettings.some(
                            (generatorOptions) =>
                            {
                                return generatorOptions[SubGeneratorSettingKey.DisplayName] === input;
                            }))
                    {
                        return `A generator with the specified display-name "${input}" already exists.`;
                    }
                    else
                    {
                        return /.+/.test(input.trim()) ? true : "The name must not be empty!";
                    }
                }
            },
            {
                name: SubGeneratorSettingKey.Name,
                message: "What's the unique name of the sub-generator?",
                default: (settings: ITSGeneratorSettings) => kebabCase(settings[SubGeneratorSettingKey.DisplayName] || ""),
                validate: (input: string) =>
                {
                    if (
                        input === "app" ||
                        this.SubGeneratorSettings.some(
                            (generatorOptions) =>
                            {
                                return generatorOptions[SubGeneratorSettingKey.Name] === input;
                            }))
                    {
                        return `A generator with the specified name "${input}" already exists.`;
                    }
                    else
                    {
                        return /[\w-]+/.test(input) ? true : "Please provide a name according to the npm naming-conventions.";
                    }
                }
            }
        ];
    }

    /**
     * Adds a new sub-generator to the array.
     */
    public async AddSubGenerator(): Promise<void>
    {
        this.SubGeneratorSettings.push(await prompt(this.Questions));
    }

    /**
     * @inheritdoc
     *
     * @param callback
     * A callback for resolving the result.
     */
    public override _run(callback: PromptCallback): void
    {
        (
            async () =>
            {
                let answerHash: IInternalAnswerHash;
                this.rl.write(this.getQuestion());
                this.rl.write(EOL);

                do
                {
                    await this.AddSubGenerator();

                    answerHash = await prompt<IInternalAnswerHash>(
                        [
                            {
                                type: "confirm",
                                name: "repeat",
                                default: this.opt.defaultRepeat,
                                message: "Do you want to create another sub-generator?"
                            }
                        ]);
                }
                while (answerHash.repeat);

                callback(this.SubGeneratorSettings);
            })();
    }
}

/**
 * Represents an answer-hash which is used inside the `SubGeneratorPrompt` class.
 */
interface IInternalAnswerHash
{
    /**
     * A value indicating whether the questions should be repeated.
     */
    repeat?: boolean;
}
