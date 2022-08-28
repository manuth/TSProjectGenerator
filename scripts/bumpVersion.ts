import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Dictionary, Package } from "@manuth/package-json-editor";
import fs from "fs-extra";
import GitBranch from "git-branch";
import { glob } from "glob";
import npmWhich from "npm-which";

const { pathExists } = fs;

(
    async () =>
    {
        let dirName = fileURLToPath(new URL(".", import.meta.url));
        let npmPackage = new Package(join(dirName, "..", Package.FileName));
        let workspacePaths: string[];
        let workspacePackages: Package[] = [];
        let branchName = await GitBranch(dirName);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(dirName).sync("npm"),
                [
                    "--no-git-tag-version",
                    "version",
                    "--workspaces",
                    releaseName,
                    "--allow-same-version"
                ]);

            let workspaceSetting: any = npmPackage.AdditionalProperties.Get("workspaces");

            if (Array.isArray(workspaceSetting))
            {
                workspacePaths = workspaceSetting;
            }
            else
            {
                workspacePaths = workspaceSetting?.packages;
            }

            for (let pattern of workspacePaths ?? [])
            {
                for (let workspacePath of glob.sync(pattern, { cwd: dirname(npmPackage.FileName) }))
                {
                    let packageFileName = join(workspacePath, Package.FileName);

                    if (await pathExists(packageFileName))
                    {
                        workspacePackages.push(new Package(packageFileName));
                    }
                }
            }

            for (let workspacePackage of workspacePackages)
            {
                for (let dependencyCandidate of workspacePackages)
                {
                    if (dependencyCandidate.Name !== workspacePackage.Name)
                    {
                        for (let entry of [
                            [workspacePackage.Dependencies, "--save"],
                            [workspacePackage.DevelopmentDependencies, "--save-dev"],
                            [workspacePackage.OptionalDependencies, "--save-optional"],
                            [workspacePackage.PeerDependencies, "--save-peer"]
                        ] as Array<[Dictionary<string, string>, string]>)
                        {
                            if (entry[0].Has(dependencyCandidate.Name))
                            {
                                spawnSync(
                                    npmWhich(dirName).sync("npm"),
                                    [
                                        "install",
                                        "--ignore-scripts",
                                        "--no-audit",
                                        "--workspace",
                                        workspacePackage.Name,
                                        entry[1],
                                        dependencyCandidate.Name
                                    ]);
                            }
                        }
                    }
                }
            }

            spawnSync(
                npmWhich(dirName).sync("npm"),
                [
                    "install",
                    "--ignore-scripts"
                ]);

            spawnSync(
                npmWhich(dirName).sync("git"),
                [
                    "commit",
                    "-a",
                    "-m",
                    `Bump the version number to ${releaseName}`
                ]);
        }
        else
        {
            console.error(`This method is not allowed on the current branch \`${branchName}\``);
        }
    })();
