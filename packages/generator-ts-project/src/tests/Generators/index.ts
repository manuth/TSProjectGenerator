import { basename } from "path";
import { AppGenerator } from "../../generators/app/AppGenerator.js";
import { TSGeneratorGenerator } from "../../generators/generator/TSGeneratorGenerator.js";
import { TSModuleGenerator } from "../../generators/module/TSModuleGenerator.js";
import { TestContext } from "../TestContext.js";
import { AppTests } from "./App/index.js";
import { GeneratorTests as TSGeneratorTests } from "./Generator/index.js";
import { ModuleTests } from "./Module/index.js";

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
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ModuleTests(moduleGeneratorContext);
            TSGeneratorTests(generatorGeneratorContext);
            AppTests(appGeneratorContext);
        });
}
