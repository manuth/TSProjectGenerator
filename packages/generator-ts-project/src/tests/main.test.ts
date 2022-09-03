import { fileURLToPath } from "node:url";
import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import upath from "upath";
import { GeneratorName } from "../Core/GeneratorName.js";
import { AppGenerator } from "../generators/app/AppGenerator.js";
import { TSGeneratorGenerator } from "../generators/generator/TSGeneratorGenerator.js";
import { TSModuleGenerator } from "../generators/module/TSModuleGenerator.js";
import { ComponentTests } from "./Components/index.test.js";
import { GeneratorTests } from "./Generators/index.test.js";
import { LintingTests } from "./Linting/index.test.js";
import { NPMPackagingTests } from "./NPMPackaging/index.test.js";
import { ProjectTests } from "./Project/index.test.js";
import { TestContext } from "./TestContext.js";
import { VSCodeTests } from "./VSCode/index.test.js";

const { join } = upath;

suite(
    "TSProjectGenerator",
    () =>
    {
        let defaultContextName = "default";
        let workingDirectory: string;
        let generatorRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "generators");
        let contextMap: Map<string, [GeneratorContext<any>, IGeneratorSettings]> = new Map();
        TestContext.Default.RegisterCleanupSkipper();
        contextMap.set(defaultContextName, [GeneratorContext.Default, null]);

        for (let namespace of [GeneratorName.Main, GeneratorName.Module, GeneratorName.Generator])
        {
            contextMap.set(namespace, [new GeneratorContext(join(generatorRoot, namespace)), null]);
        }

        let appContext = new TestContext(contextMap.get(GeneratorName.Main)[0] as GeneratorContext<AppGenerator>);
        let moduleContext = new TestContext(contextMap.get(GeneratorName.Module)[0] as GeneratorContext<TSModuleGenerator>);
        let generatorContext = new TestContext(contextMap.get(GeneratorName.Generator)[0] as GeneratorContext<TSGeneratorGenerator>);

        suiteSetup(
            () =>
            {
                workingDirectory = process.cwd();
            });

        suiteTeardown(
            () =>
            {
                for (let entry of contextMap.values())
                {
                    let context = entry[0];
                    context.Dispose();
                }
            });

        teardown(
            async () =>
            {
                for (let entry of contextMap.values())
                {
                    let context = entry[0];
                    await context.ResetSettings();
                }

                process.chdir(workingDirectory);
            });

        ComponentTests();
        NPMPackagingTests();
        VSCodeTests();
        LintingTests(moduleContext);
        ProjectTests(moduleContext);

        GeneratorTests(
            moduleContext,
            generatorContext,
            appContext);
    });
