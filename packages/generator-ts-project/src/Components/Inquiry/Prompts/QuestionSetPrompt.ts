import { Interface } from "readline";
import { Answers, createPromptModule, DistinctQuestion, Question } from "inquirer";
import { IQuestionSetQuestion } from "./IQuestionSetQuestion";
import { IQuestionSetQuestionOptions } from "./IQuestionSetQuestionOptions";
import { NestedPrompt } from "./NestedPrompt";
import { SetQuestion } from "./SetQuestion";

/**
 * Represents an answer-hash.
 */
type AnswerHash = Answers;

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
        [QuestionSetPrompt.TypeName]: IQuestionSetQuestion<AnswerHash, T>;
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
        let processedQuestions: Array<Question<TAnswers>> = [];
        let promptModule = createPromptModule();

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
            let overrides: Partial<DistinctQuestion<TAnswers>> = {};

            for (
                let key of [
                    nameof<DistinctQuestion<TAnswers>>((q) => q.message),
                    nameof<DistinctQuestion<TAnswers>>((q) => q.default),
                    nameof<DistinctQuestion<TAnswers>>((q) => q.when)
                ] as Array<keyof DistinctQuestion<TAnswers>>)
            {
                let base = question[key];

                if (typeof base === "function")
                {
                    overrides[key] = async (answers: TAnswers) =>
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
