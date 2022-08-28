import { fileURLToPath } from "url";
import { GeneratorName } from "@manuth/generator-ts-project";
import { GeneratorContext } from "@manuth/generator-ts-project-test";
import upath from "upath";
import { DependabotFileMappingTests } from "./DependabotFileMapping.test.js";
import { DroneFileMappingTests } from "./DroneFileMapping.test.js";
import { MarkdownFileProcessorTests } from "./MarkdownFileProcessor.test.js";
import { MyTSProjectGeneratorTests } from "./MyTSProjectGenerator.test.js";
import { MyTSProjectPackageFileMappingTests } from "./MyTSProjectPackageFileMapping.test.js";
import { TestTSModuleGenerator } from "./TestTSModuleGenerator.js";

const { join } = upath;

suite(
    "MyTSProjectGenerator",
    () =>
    {
        let workingDir: string;
        let context = GeneratorContext.Default;

        let projectContext = new GeneratorContext<TestTSModuleGenerator>(join(fileURLToPath(new URL(".", import.meta.url)), "generators", GeneratorName.Main));

        suiteSetup(
            () =>
            {
                workingDir = process.cwd();
            });

        suiteTeardown(
            () =>
            {
                process.chdir(workingDir);

                for (let testContext of [context, projectContext])
                {
                    testContext.Dispose();
                }
            });

        MyTSProjectGeneratorTests(projectContext);
        MarkdownFileProcessorTests();
        DroneFileMappingTests(projectContext);
        DependabotFileMappingTests(projectContext);
        MyTSProjectPackageFileMappingTests(projectContext);
    });
