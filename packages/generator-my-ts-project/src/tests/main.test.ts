import { GeneratorName } from "@manuth/generator-ts-project";
import { GeneratorContext } from "@manuth/generator-ts-project-test";
import { join } from "upath";
import { DependabotFileMappingTests } from "./DependabotFileMapping.test";
import { DroneFileMappingTests } from "./DroneFileMapping.test";
import { MarkdownFileProcessorTests } from "./MarkdownFileProcessor.test";
import { MyTSProjectGeneratorTests } from "./MyTSProjectGenerator.test";
import { MyTSProjectPackageFileMappingTests } from "./MyTSProjectPackageFileMapping.test";
import { TestTSModuleGenerator } from "./TestTSModuleGenerator";

suite(
    "MyTSProjectGenerator",
    () =>
    {
        let workingDir: string;
        let context = GeneratorContext.Default;

        let projectContext = new GeneratorContext<TestTSModuleGenerator>(join(__dirname, "generators", GeneratorName.Main));

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
