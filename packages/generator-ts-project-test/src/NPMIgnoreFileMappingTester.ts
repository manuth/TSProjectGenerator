import { doesNotReject, strictEqual } from "node:assert";
import { basename, dirname, resolve } from "node:path";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { TempDirectory, TempFile } from "@manuth/temp-files";
import rescape from "@stdlib/utils-escape-regexp-string";
import fs from "fs-extra";
import packlist from "npm-packlist";
import upath from "upath";

const { lstat, pathExists, readdir } = fs;
const { normalize } = upath;

/**
 * Provides the functionality to test `.npmignore` file-mappings.
 *
 * @template TGenerator
 * The type of the generator for testing the file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TFileMapping
 * The type of the file-mapping to test.
 */
export class NPMIgnoreFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>
{
    /**
     * Initializes a new instance of the {@link NPMIgnoreFileMappingTester `NPMIgnoreFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets the list of the files which are included by the `.npmignore`-file.
     *
     * @returns
     * The list of the files which are included by the `.npmignore`-file.
     */
    public async GetFileList(): Promise<string[]>
    {
        return (await packlist(
            {
                path: dirname(this.FileMapping.Destination)
            })).map(
                (path) =>
                {
                    return normalize(resolve(dirname(this.FileMapping.Destination), path));
                });
    }

    /**
     * Asserts the inclusion of the file at the specified {@link path `path`} according to the `.npmignore`-file.
     *
     * @param path
     * The path to check.
     *
     * @param ignored
     * A value indicating whether the file at the specified {@link path `path`} is expected to be ignored.
     */
    public async AssertIgnored(path: string, ignored = true): Promise<void>
    {
        let tempFile: TempFile = null;
        path = normalize(path);

        try
        {
            if (!await pathExists(path))
            {
                tempFile = new TempFile(
                    {
                        Prefix: "",
                        Suffix: "",
                        Directory: dirname(path),
                        FileNamePattern: rescape(basename(path))
                    });
            }

            strictEqual(
                (await this.GetFileList()).includes(path),
                !ignored,
                `The file \`${path}\` unexpectedly is ${ignored ? "not " : ""}ignored!`);
        }
        catch (e)
        {
            throw e;
        }
        finally
        {
            tempFile?.Dispose();
        }
    }

    /**
     * Asserts the inclusion of the directory with the specified {@link path `path`} according to the `.npmignore`-file.
     *
     * @param path
     * The path to check.
     *
     * @param ignored
     * A value indicating whether the directory with the specified {@link path `path`} is expected to be ignored.
     */
    public async AssertDirectoryIgnored(path: string, ignored = true): Promise<void>
    {
        let tempDir: TempDirectory = null;
        let tempFile: TempFile = null;
        path = normalize(resolve(dirname(this.FileMapping.Destination), path));

        try
        {
            if (!await pathExists(path))
            {
                tempDir = new TempDirectory(
                    {
                        Suffix: "",
                        Prefix: "",
                        Directory: dirname(path),
                        FileNamePattern: rescape(basename(path))
                    });
            }

            let files = await readdir(path);

            await doesNotReject(
                async () =>
                {
                    if (files.length === 0)
                    {
                        tempFile = new TempFile(
                            {
                                Directory: path
                            });

                        await doesNotReject(() => this.AssertIgnored(tempFile.FullName, ignored));
                    }
                    else
                    {
                        for (let file of files)
                        {
                            let fileEntryName = resolve(dirname(this.FileMapping.Destination), path, file);

                            if ((await lstat(fileEntryName)).isDirectory())
                            {
                                await this.AssertDirectoryIgnored(fileEntryName, ignored);
                            }
                            else
                            {
                                await this.AssertIgnored(fileEntryName, ignored);
                            }
                        }
                    }
                },
                `The directory \`${path}\` unexpectedly is ${ignored ? "not " : ""}ignored!`);
        }
        catch (e)
        {
            throw e;
        }
        finally
        {
            tempFile?.Dispose();
            tempDir?.Dispose();
        }
    }
}
