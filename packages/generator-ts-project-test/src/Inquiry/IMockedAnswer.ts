import { MockSTDIN } from "mock-stdin";

/**
 * Represents a mocked answer for a prompt.
 */
export interface IMockedAnswer
{
    /**
     * THe input to pass.
     */
    input?: string[];

    /**
     * The callback to execute before sending the input.
     *
     * @param mockedStdin
     * The mocked {@link process.stdin `process.stdin`}.
     */
    preprocess?: (mockedStdin: MockSTDIN) => void;

    /**
     * The callback to execute after sending the input.
     *
     * @param mockedStdin
     * The mocked {@link process.stdin `process.stdin`}.
     */
    callback?: (mockedStdin: MockSTDIN) => void;
}
