import { ReadLine } from "readline";
import { Answers, DistinctQuestion, prompt } from "inquirer";
import kebabCase = require("lodash.kebabcase");
import { ISubGenerator } from "../../../generators/generator/Settings/ISubGenerator";
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey";
import { ArrayPrompt } from "./ArrayPrompt";
import { IArrayPromptHash } from "./IArrayPromptHash";
import { IArrayQuestionOptions } from "./IArrayQuestionOptions";
import { ISubGeneratorQuestion } from "./ISubGeneratorQuestion";

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
    public constructor(question: T, readLine: ReadLine, answers: Answers)
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
        return prompt(
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
    protected override async GetRepetitionQuestion(items: readonly ISubGenerator[]): Promise<DistinctQuestion<IArrayPromptHash>>
    {
        return {
            ...await super.GetRepetitionQuestion(items),
            message: "Do you want to add another sub-generator?"
        };
    }
}
