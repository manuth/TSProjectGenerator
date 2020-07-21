import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Components";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let context = TestContext.Default;
        ComponentTests(context);
        require("./Generators");
    });
