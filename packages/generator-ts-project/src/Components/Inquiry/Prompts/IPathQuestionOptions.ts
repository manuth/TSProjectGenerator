import { PlatformPath } from "path";
import { Answers, AsyncDynamicQuestionProperty, InputQuestionOptions } from "inquirer";
import { IPathPromptRootDescriptor } from "./IPathPromptRootDescriptor.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PathPrompt } from "./PathPrompt.js";

/**
 * Provides options for the {@link PathPrompt `PathPrompt`}.
 *
 * @template T
 * The type of the answers.
 */
export interface IPathQuestionOptions<T extends Answers = Answers> extends InputQuestionOptions<T>
{
    /**
     * A component for handling file-system paths.
     */
    path?: PlatformPath;

    /**
     * The directory to use for resolving relative paths for the {@link IPathQuestionOptions.default `default`} value and the answer.
     */
    rootDir?: AsyncDynamicQuestionProperty<IPathPromptRootDescriptor | string, T>;
}
