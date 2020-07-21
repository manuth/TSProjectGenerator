import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let context = TestContext.Default;
        ComponentTests(context);
        GeneratorTests(context);
    });
