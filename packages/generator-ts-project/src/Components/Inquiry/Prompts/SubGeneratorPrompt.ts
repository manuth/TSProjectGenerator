import { ReadLine } from "readline";
import inquirer from "inquirer";
import kebabCase from "lodash.kebabcase";
import { ISubGenerator } from "../../../generators/generator/Settings/ISubGenerator.js";
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey.js";
import { ArrayPrompt } from "./ArrayPrompt.js";
import { IArrayPromptHash } from "./IArrayPromptHash.js";
import { IArrayQuestionOptions } from "./IArrayQuestionOptions.js";
import { ISubGeneratorQuestion } from "./ISubGeneratorQuestion.js";

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
 * The type of the options for the question.
 */
export class SubGeneratorPrompt<T extends IArrayQuestionOptions> extends ArrayPrompt<T, ISubGenerator>
{
    /**
     * The name of the prompt-type.
     */
    public static readonly TypeName = "sub-generators";

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
    public constructor(question: T, readLine: ReadLine, answers: inquirer.Answers)
    {
        super(question, readLine, answers);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The currently stored items.
     *
     * @returns
     * The new item to add to the result.
     */
    protected PromptItem(items: readonly ISubGenerator[]): Promise<ISubGenerator>
    {
        return inquirer.prompt(
            [
                {
                    name: SubGeneratorSettingKey.DisplayName,
                    message: "What's the human-readable name of the sub-generator?",
                    validate: (input: string) =>
                    {
                        if (
                            items.some(
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
                            items.some(
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
            ]);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The currently stored items.
     *
     * @returns
     * A question for asking the user whether another item should be added.
     */
    protected override async GetRepetitionQuestion(items: readonly ISubGenerator[]): Promise<inquirer.DistinctQuestion<IArrayPromptHash>>
    {
        return {
            ...await super.GetRepetitionQuestion(items),
            message: "Do you want to add another sub-generator?"
        };
    }
}
