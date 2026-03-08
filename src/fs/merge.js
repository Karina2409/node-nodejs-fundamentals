import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const merge = async () => {
    const workspaceDir = path.resolve(process.cwd(), 'workspace');
    const partsDir = path.join(workspaceDir, 'parts');
    const outputFile = path.join(workspaceDir, 'merged.txt');

    try {
        const stat = await fs.stat(partsDir);
        if (!stat.isDirectory()) {
            throw new Error('FS operation failed');
        }

        const args = process.argv.slice(2);
        const filesIndex = args.indexOf('--files');

        let filesToMerge = [];

        if (filesIndex !== -1 && filesIndex + 1 < args.length) {
            const filenames = args[filesIndex + 1];
            filesToMerge = filenames.split(',').map(fileName => fileName.trim()).filter(Boolean);

            if (filesToMerge.length === 0) {
                throw new Error('FS operation failed');
            }

            for (const filename of filesToMerge) {
                const filePath = path.join(partsDir, filename);
                await fs.access(filePath);
            }
        } else {
            const entries = await fs.readdir(partsDir, {withFileTypes: true});

            filesToMerge = entries
                .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.txt')
                .map((entry) => entry.name)
                .sort((a, b) => a.localeCompare(b));

            if (filesToMerge.length === 0) {
                throw new Error('FS operation failed');
            }
        }

        const contents = [];

        for (const filename of filesToMerge) {
            const filePath = path.join(partsDir, filename);
            const content = await fs.readFile(filePath, 'utf8');
            contents.push(content);
        }

        const mergedContent = contents.join('\n');

        await fs.writeFile(outputFile, mergedContent, 'utf8');
    } catch {
        throw new Error('FS operation failed');
    }
};

await merge();
