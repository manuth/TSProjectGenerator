import Assert = require("assert");
import { spawnSync } from "child_process";
import { TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import npmWhich = require("npm-which");
import { AppGenerator } from "../../../generators/app/AppGenerator";
import { ProjectType } from "../../../generators/app/ProjectType";
import { ProjectSelectorSettingKey } from "../../../generators/app/Settings/ProjectSelectorSettingKey";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppGeneratorTests(context: TestContext<AppGenerator>): void
{
    suite(
        "AppGenerator",
        () =>
        {
            let tempDir: TempDirectory;

            setup(
                () =>
                {
                    tempDir = new TempDirectory();
                });

            test(
                "Checking whether the generator can be executed…",
                async function()
                {
                    this.timeout(0);
                    this.slow(1.5 * 60 * 1000);
                    await Assert.doesNotReject(async () => context.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                });

            test(
                "Checking whether modules can be generated…",
                async function()
                {
                    this.timeout(0);
                    this.slow(3 * 60 * 1000);

                    await Assert.doesNotReject(
                        () =>
                        {
                            return context.ExecuteGenerator().withPrompts(
                                {
                                    [ProjectSelectorSettingKey.ProjectType]: ProjectType.Module
                                }).inDir(tempDir.FullName).toPromise();
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    Assert.doesNotThrow(
                        () =>
                        {
                            require(tempDir.FullName);
                        });
                });

            test(
                "Checking whether generators can be generated…",
                async function()
                {
                    this.timeout(0);
                    this.slow(5 * 60 * 1000);
                    let subGeneratorDir = new TempDirectory();

                    await Assert.doesNotReject(
                        async () =>
                        {
                            return context.ExecuteGenerator().withPrompts(
                                {
                                    [ProjectSelectorSettingKey.ProjectType]: ProjectType.Generator
                                }).inDir(tempDir.FullName).toPromise();
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    await Assert.doesNotReject(
                        async () =>
                        {
                            return new GeneratorContext(
                                tempDir.MakePath("lib", "generators", "app")).ExecuteGenerator().inDir(
                                    subGeneratorDir.FullName).toPromise();
                        });
                });
        });
}
