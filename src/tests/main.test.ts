import { TestContext } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { AppGenerator } from "../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../generators/generator/TSGeneratorGenerator";
import { TSModuleGenerator } from "../generators/module/TSModuleGenerator";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";
import { LintingTests } from "./Linting";
import { NPMPackagingTests } from "./NPMPackaging";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let generatorRoot = join(__dirname, "..", "..", "generators");
        let context = TestContext.Default;
        let appGeneratorContext: TestContext<AppGenerator> = new TestContext(join(generatorRoot, "app"));
        let generatorGeneratorContext: TestContext<TSGeneratorGenerator> = new TestContext(join(generatorRoot, "generator"));
        let moduleGeneratorContext: TestContext<TSModuleGenerator> = new TestContext(join(generatorRoot, "module"));

        ComponentTests(context);
        NPMPackagingTests(context);
        LintingTests(moduleGeneratorContext);
        GeneratorTests(moduleGeneratorContext, generatorGeneratorContext, appGeneratorContext);
    });
