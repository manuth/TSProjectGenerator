import { Generator } from "@manuth/extended-yo-generator";
import { TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";

/**
 * Represents a context for testing.
 */
export class TestContext<TGenerator extends Generator, TOptions extends Record<string, any> = Record<string, any>> extends GeneratorContext<TGenerator, TOptions>
{
    /**
     * A context for testing generators.
     */
    private generatorContext: GeneratorContext<TGenerator, TOptions>;

    /**
     * Initializes a new instance of the `TestContext` class.
     *
     * @param generatorContext
     * A context for testing generators.
     */
    public constructor(generatorContext: GeneratorContext<TGenerator, TOptions>)
    {
        super(generatorContext.GeneratorDirectory);
    }

    /**
     * Gets a context for testing generators.
     */
    public get GeneratorContext(): GeneratorContext<TGenerator, TOptions>
    {
        return this.generatorContext;
    }

    /**
     * @inheritdoc
     */
    public get Generator(): Promise<TGenerator>
    {
        return this.GeneratorContext.Generator;
    }
}
