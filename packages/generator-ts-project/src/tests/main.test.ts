import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
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
    "TSGeneratorGenerator",
    () =>
    {
        let workingDirectory: string;
        let generatorRoot = join(__dirname, "..", "generators");
        let contextMap: Map<string, [GeneratorContext, IGeneratorSettings]> = new Map();
        contextMap.set("default", [GeneratorContext.Default, null]);

        for (let namespace of ["app", "generator", "module"])
        {
            contextMap.set(namespace, [new GeneratorContext(join(generatorRoot, namespace)), null]);
        }

        let defaultContext = new TestContext(contextMap.get("default")[0] as GeneratorContext<TestGenerator>);
        let appContext = new TestContext(contextMap.get("app")[0] as GeneratorContext<AppGenerator>);
        let generatorContext = new TestContext(contextMap.get("generator")[0] as GeneratorContext<TSGeneratorGenerator>);
        let moduleContext = new TestContext(contextMap.get("module")[0] as GeneratorContext<TSModuleGenerator>);

        suiteSetup(
            async function()
            {
                this.timeout(0);
                workingDirectory = process.cwd();

                for (let entry of contextMap.values())
                {
                    let generator = await entry[0].Generator;
                    entry[1] = { ...generator.Settings };
                }
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

        setup(
            async () =>
            {
                for (let namespace of contextMap.keys())
                {
                    let entry = contextMap.get(namespace);
                    let generator = await entry[0].Generator;
                    let settings = generator.Settings as any;

                    for (let key in settings)
                    {
                        delete settings[key];
                    }

                    Object.assign(settings, entry[1]);
                }

                process.chdir(workingDirectory);
            });

        ComponentTests(defaultContext);
        NPMPackagingTests(defaultContext);
        VSCodeTests(defaultContext);
        LintingTests(moduleContext);
        ProjectTests(moduleContext);

        GeneratorTests(
            moduleContext,
            generatorContext,
            appContext);
    });
