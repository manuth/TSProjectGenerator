import { TestContext } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { TSProjectGenerator } from "../Project/TSProjectGenerator";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";
import { LintingTests } from "./Linting";
import { NPMPackagingTests } from "./NPMPackaging";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let context = TestContext.Default;
        let projectGeneratorContext = new TestContext<TSProjectGenerator>(join(__dirname, "..", "generators", "module"));
        ComponentTests(context);
        NPMPackagingTests(context);
        LintingTests(projectGeneratorContext);
        GeneratorTests(context);
    });
