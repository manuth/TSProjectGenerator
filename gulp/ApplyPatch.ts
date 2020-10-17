import { applyPatch, parsePatch } from "diff";
import { readFile } from "fs-extra";
import { obj } from "through2";
import File = require("vinyl");

/**
 * Applies a patch to the stream.
 *
 * @param patchPath
 * The path to the patch to apply.
 *
 * @returns
 * The resulting stream.
 */
export function ApplyPatch(patchPath: string): NodeJS.ReadWriteStream
{
    return obj(
        async (vinylFile: File, encoding, callback) =>
        {
            if (vinylFile.isBuffer())
            {
                let contents = vinylFile.contents.toString(encoding);

                vinylFile.contents = Buffer.from(
                    applyPatch(
                        contents,
                        parsePatch(
                            (await readFile(patchPath)).toString())[0]), encoding);

                callback(null, vinylFile);
            }
            else
            {
                callback(new Error("Only buffers are supported."));
            }
        });
}
