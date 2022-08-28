import { Interface } from "readline";
import inquirer from "inquirer";
import { IQuestionSetQuestion } from "./IQuestionSetQuestion.js";
import { IQuestionSetQuestionOptions } from "./IQuestionSetQuestionOptions.js";
import { NestedPrompt } from "./NestedPrompt.js";
import { SetQuestion } from "./SetQuestion.js";

/**
 * Represents an answer-hash.
 */
type Answers = inquirer.Answers;

declare module "inquirer"
{
    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface QuestionMap<T>
    {
        /**
         * Represents the question-collection prompt.
         */
        [QuestionSetPrompt.TypeName]: IQuestionSetQuestion<Answers, T>;
    }
}

/**
 * Provides the functionality to ask a set of questions in a nested context.
 *
 * @template TAnswers
 * The type of the answer-hash of the inner questions.
 *
 * @template TQuestion
 * The type of the options for the question.
 */
export class QuestionSetPrompt<TAnswers extends Answers = Answers, TQuestion extends IQuestionSetQuestionOptions<TAnswers> = IQuestionSetQuestionOptions<TAnswers>> extends NestedPrompt<TQuestion>
{
    /**
     * The name of the prompt-type.
     */
    public static readonly TypeName = "questions";

    /**
     * Initializes a new instance of the {@link QuestionSetPrompt `QuestionSetPrompt<TAnswers, TQuestion>`} class.
     *
     * @param question
     * The question to prompt the user to answer.
     *
     * @param readLine
     * An object for reading from and writing to the console.
     *
     * @param answers
     * The answer-hash.
     */
    public constructor(question: TQuestion, readLine: Interface, answers: Answers)
    {
        super(question, readLine, answers);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The value to save to the answer-hash.
     */
    protected async Prompt(): Promise<unknown>
    {
        let questions: Array<SetQuestion<TAnswers, unknown>>;
        let processedQuestions: Array<inquirer.Question<TAnswers>> = [];
        let promptModule = inquirer.createPromptModule();

        if (this.opt.promptTypes)
        {
            for (let promptName in this.opt.promptTypes)
            {
                promptModule.registerPrompt(promptName, this.opt.promptTypes[promptName]);
            }
        }

        if (typeof this.opt.questions === "function")
        {
            questions = await this.opt.questions(this.answers);
        }
        else
        {
            questions = await this.opt.questions;
        }

        for (let question of questions)
        {
            let overrides: Partial<inquirer.DistinctQuestion<TAnswers>> = {};

            for (
                let key of [
                    nameof<inquirer.DistinctQuestion<TAnswers>>((q) => q.message),
                    nameof<inquirer.DistinctQuestion<TAnswers>>((q) => q.default),
                    nameof<inquirer.DistinctQuestion<TAnswers>>((q) => q.when)
                ] as Array<keyof inquirer.DistinctQuestion<TAnswers>>)
            {
                let base = question[key];

                if (typeof base === "function")
                {
                    (overrides as any)[key] = async (answers: TAnswers) =>
                    {
                        return question[key](
                            answers,
                            {
                                ...this.answers,
                                [question.name]: answers
                            });
                    };
                }
            }

            if (typeof question.filter === "function")
            {
                overrides.filter = (input, answers) =>
                {
                    return question.filter(input, answers, this.answers);
                };
            }

            if (typeof question.validate === "function")
            {
                overrides.validate = (input, answers) =>
                {
                    return question.validate(input, answers, this.answers);
                };
            }

            processedQuestions.push(
                {
                    ...question,
                    ...overrides
                });
        }

        return promptModule(processedQuestions);
    }
}
