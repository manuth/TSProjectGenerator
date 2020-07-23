import { TestContext, TestGenerator, ITestOptions, ITestGeneratorOptions } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { AppGenerator } from "../../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../../generators/generator/TSGeneratorGenerator";
import { TSModuleGenerator } from "../../generators/module/TSModuleGenerator";
import { AppTests } from "./App";
import { GeneratorTests as TSGeneratorTests } from "./Generator";
import { ModuleTests } from "./Module";

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
    let moduleGeneratorContext: TestContext<TSModuleGenerator> = new TestContext(join(generatorRoot, "module"));

    suite(
        "Generators",
        () =>
        {
            AppTests(appGeneratorContext);
            TSGeneratorTests(generatorGeneratorContext);
            ModuleTests(moduleGeneratorContext);
        });
}
