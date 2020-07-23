import { TestContext } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { TSProjectGenerator } from "../Project/TSProjectGenerator";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";
import { LintingTests } from "./Linting";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let context = TestContext.Default;
        let projectGeneratorContext = new TestContext<TSProjectGenerator>(join(__dirname, "..", "generators", "module"));
        ComponentTests(context);
        LintingTests(projectGeneratorContext);
        GeneratorTests(context);
    });
