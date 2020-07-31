import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { join } from "upath";
import { AppGenerator } from "../generators/app/AppGenerator";
import { TSGeneratorGenerator } from "../generators/generator/TSGeneratorGenerator";
import { TSModuleGenerator } from "../generators/module/TSModuleGenerator";
import { ComponentTests } from "./Components";
import { GeneratorTests } from "./Generators";
import { LintingTests } from "./Linting";
import { NPMPackagingTests } from "./NPMPackaging";
import { ProjectTests } from "./Project";

suite(
    "TSGeneratorGenerator",
    () =>
    {
        let workingDirectory: string;
        let generatorRoot = join(__dirname, "..", "generators");
        let contextMap: Map<string, [TestContext, IGeneratorSettings]> = new Map();
        contextMap.set("default", [TestContext.Default, null]);

        for (let namespace of ["app", "generator", "module"])
        {
            contextMap.set(namespace, [new TestContext(join(generatorRoot, namespace)), null]);
        }

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

        ComponentTests(contextMap.get("default")[0] as TestContext<TestGenerator>);
        NPMPackagingTests(contextMap.get("default")[0] as TestContext<TestGenerator>);
        LintingTests(contextMap.get("module")[0] as TestContext<TSModuleGenerator>);
        ProjectTests(contextMap.get("module")[0] as TestContext<TSModuleGenerator>);

        GeneratorTests(
            contextMap.get("module")[0] as TestContext<TSModuleGenerator>,
            contextMap.get("generator")[0] as TestContext<TSGeneratorGenerator>,
            contextMap.get("app")[0] as TestContext<AppGenerator>);
    });
