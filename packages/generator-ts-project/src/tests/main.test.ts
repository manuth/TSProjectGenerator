import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { GeneratorContext } from "@manuth/generator-ts-project-test";
import { join } from "upath";
import { GeneratorName } from "../Core/GeneratorName";
import { AppGenerator } from "../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../generators/generator/TSGeneratorGenerator";
import { TSModuleGenerator } from "../generators/module/TSModuleGenerator";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";
import { LintingTests } from "./Linting";
import { NPMPackagingTests } from "./NPMPackaging";
import { ProjectTests } from "./Project";
import { TestContext } from "./TestContext";
import { VSCodeTests } from "./VSCode";

suite(
    "TSProjectGenerator",
    () =>
    {
        let defaultContextName = "default";
        let workingDirectory: string;
        let generatorRoot = join(__dirname, "..", "generators");
        let contextMap: Map<string, [GeneratorContext<any>, IGeneratorSettings]> = new Map();
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

        suiteTeardown(
            () =>
            {
                for (let entry of contextMap.values())
                {
                    let context = entry[0];
                    context.Dispose();
                }
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
