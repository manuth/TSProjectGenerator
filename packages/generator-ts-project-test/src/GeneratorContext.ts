import { Generator, GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IRunContext, ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import helpers, { RunContextSettings } from "yeoman-test";

/**
 * Represents a context for testing.
 *
 * @template TGenerator
 * The type of the generator to test.
 *
 * @template TOptions
 * The type of the options of the generator to test.
 */
export class GeneratorContext<TGenerator extends Generator<any, TOptions> = Generator<IGeneratorSettings, any>, TOptions extends GeneratorOptions = GeneratorOptions> extends TestContext<TGenerator, TOptions>
{
    /**
     * Gets the default instance of the {@link GeneratorContext `GeneratorContext<TGenerator, TOptions>`} class.
     */
    public static override get Default(): TestContext<TestGenerator<IGeneratorSettings, ITestOptions>, ITestGeneratorOptions<ITestOptions>>
    {
        return new GeneratorContext(TestContext.Default.GeneratorDirectory);
    }

    /**
     * @inheritdoc
     *
     * @param options
     * The options for the generator.
     *
     * @param runSettings
     * The settings for executing the generator.
     *
     * @returns
     * The execution-context of the generator.
     */
    public override ExecuteGenerator(options?: TOptions, runSettings?: RunContextSettings): IRunContext<TGenerator>
    {
        let result = super.ExecuteGenerator(options, runSettings);
        result.on("ready", (generator) => helpers.mockPrompt(generator, result.answers));
        return result;
    }
}
