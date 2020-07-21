import { TestContext, TestGenerator, ITestOptions, ITestGeneratorOptions } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { AppGenerator } from "../../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../../generators/generator/TSGeneratorGenerator";
import { AppTests } from "./App";
import { GeneratorTests as TSGeneratorTests } from "./Generator";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    let generatorRoot = join(__dirname, "..", "..", "generators");
    let appGeneratorContext: TestContext<AppGenerator> = new TestContext(join(generatorRoot, "app"));
    let generatorGeneratorContext: TestContext<TSGeneratorGenerator> = new TestContext(join(generatorRoot, "generator"));

    suite(
        "Generators",
        () =>
        {
            AppTests(appGeneratorContext);
            TSGeneratorTests(generatorGeneratorContext);
            require("./TSGeneratorGenerator.test");
        });
}
