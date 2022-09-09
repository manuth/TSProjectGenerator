import { DistinctQuestion } from "inquirer";
import { IQuestionSetQuestionOptions } from "@manuth/generator-ts-project";

interface IAnswerHash
{
    test: string;
}

let questions: Array<
    DistinctQuestion<IAnswerHash> & {
        custom?: boolean
    }> = [
        {
            type: "input" as const,
            name: "test1"
        },
        {
            type: "input" as const,
            name: "test2"
        }
    ];

let options: IQuestionSetQuestionOptions<IAnswerHash, any> = {
    questions
};
