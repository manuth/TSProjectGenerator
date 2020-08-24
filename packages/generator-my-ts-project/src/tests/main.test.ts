import { TestContext } from "@manuth/extended-yo-generator-test";
import { MarkdownFileProcessorTests } from "./MarkdownFileProcessor.test";

suite(
    "MyTSProjectGenerator",
    () =>
    {
        let context = TestContext.Default;
        MarkdownFileProcessorTests(context);
    });
