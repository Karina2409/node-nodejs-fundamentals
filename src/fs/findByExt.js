import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const workspaceDir = path.resolve(path.join(process.cwd(), 'workspace'));

const findByExt = async () => {
    const args = process.argv.slice(2);
    let ext;
    const extIndex = args.indexOf('--ext');
    ext = args[extIndex + 1];
    if (!ext.startsWith('.')) {
        ext = '.' + ext;
    }

    try {
        const stat = await fs.stat(workspaceDir);
        if (!stat.isDirectory()) {
            throw new Error('FS operation failed');
        }
    } catch (err) {
        throw new Error('FS operation failed');
    }

    const matchFiles = [];

    await getMatchingFiles(workspaceDir, ext, matchFiles);

    matchFiles.sort((a, b) => a.localeCompare(b));
    console.log(matchFiles.join('\n'));
};

async function getMatchingFiles (dir, ext, matchFiles) {
    let entries;
    entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await getMatchingFiles(fullPath, ext, matchFiles);
        } else if (entry.isFile()) {
            if (path.extname(entry.name).toLowerCase() === ext.toLowerCase()) {
                const relative = path.relative(workspaceDir, fullPath).replace(/\\/g, '/');
                matchFiles.push(relative);
            }
        }
    }
}

await findByExt();
