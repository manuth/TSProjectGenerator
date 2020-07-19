import { Node, TransformerFactory } from "typescript";

/**
 * Provides the functionality to transpile typescript-code based on the specified `transformers`.
 */
export type Transpiler<T extends Node> =
    /**
     * Transpiles code.
     *
     * @param code
     * The code to transpile.
     *
     * @param transformers
     * The transformers to use.
     *
     * @returns
     * The transpiled code.
     */
    (code: string, transformers: Array<TransformerFactory<T>>) => string;
