import { Interface } from "readline";
import { Answers, createPromptModule, DistinctQuestion } from "inquirer";
import { IQuestionSetQuestion } from "./IQuestionSetQuestion";
import { IQuestionSetQuestionOptions } from "./IQuestionSetQuestionOptions";
import { NestedPrompt } from "./NestedPrompt";

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
        let questions: Array<DistinctQuestion<TAnswers>>;
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

        return promptModule(questions);
    }
}
