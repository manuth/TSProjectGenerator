import { EOL } from "os";
import { ReadLine } from "readline";
import { DistinctQuestion, prompt } from "inquirer";
import kebabCase = require("lodash.kebabcase");
import { ISubGenerator } from "../../../generators/generator/Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey";
import { ISubGeneratorQuestion } from "./ISubGeneratorQuestion";
import { PromptBase } from "./PromptBase";

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
 * Provides a prompt for asking for sub-generators.
 *
 * @template T
 * The type of the answers.
 */
export class SubGeneratorPrompt<T extends ITSGeneratorSettings> extends PromptBase<ISubGeneratorQuestion<T>>
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
     * Initializes a new instance of the {@link SubGeneratorPrompt `SubGeneratorPrompt<T>`} class.
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
     * @returns
     * The result of the prompt.
     */
    protected override async Run(): Promise<unknown>
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
                        name: nameof<IInternalAnswerHash>((hash) => hash.repeat),
                        default: this.opt.defaultRepeat,
                        message: "Do you want to create another sub-generator?"
                    }
                ]);
        }
        while (answerHash.repeat);

        return this.SubGeneratorSettings;
    }
}

/**
 * Represents an answer-hash which is used inside the {@link SubGeneratorPrompt `SubGeneratorPrompt<T>`} class.
 */
interface IInternalAnswerHash
{
    /**
     * A value indicating whether the questions should be repeated.
     */
    repeat?: boolean;
}
