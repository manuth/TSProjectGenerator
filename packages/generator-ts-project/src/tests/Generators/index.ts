import { basename } from "path";
import { AppGenerator } from "../../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../../generators/generator/TSGeneratorGenerator";
import { TSModuleGenerator } from "../../generators/module/TSModuleGenerator";
import { TestContext } from "../TestContext";
import { AppTests } from "./App";
import { GeneratorTests as TSGeneratorTests } from "./Generator";
import { ModuleTests } from "./Module";

/**
 * Registers tests for the generators.
 *
 * @param moduleGeneratorContext
 * A test-context for module-generators.
 *
 * @param generatorGeneratorContext
 * A test-context for generator-generators.
 *
 * @param appGeneratorContext
 * A test-context for app-generators.
 */
export function GeneratorTests(moduleGeneratorContext: TestContext<TSModuleGenerator>, generatorGeneratorContext: TestContext<TSGeneratorGenerator>, appGeneratorContext: TestContext<AppGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            ModuleTests(moduleGeneratorContext);
            TSGeneratorTests(generatorGeneratorContext);
            AppTests(appGeneratorContext);
        });
}
