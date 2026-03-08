import fs from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';


const snapshot = async () => {
    const workspacePath = path.resolve(path.join(process.cwd(), 'workspace'));
    const snapshotPath = path.join(path.dirname(workspacePath), 'snapshot.json');
    try {
        const stat = await fs.stat(workspacePath);
        if (!stat.isDirectory()) {
            throw new Error('FS operation failed');
        }
        const entries = await collectEntries(workspacePath);
        const snapshotData = {
            rootPath: workspacePath.replace(/\\/g, '/'),
            entries
        }

        await fs.writeFile(
            snapshotPath,
            JSON.stringify(snapshotData, null, 2),
            'utf-8'
        )

        console.log(snapshotData)
    } catch {
        throw new Error('FS operation failed');
    }

};

async function collectEntries(dirAbs, relPrefix = '') {
    const entries = [];
    const items = await fs.readdir(dirAbs, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dirAbs, item.name);
        const relPath = path.posix.join(relPrefix, item.name);

        if (item.isDirectory()) {
            entries.push({
                path: relPath,
                type: 'directory'
            });
            const nested = await collectEntries(fullPath, relPath);
            entries.push(...nested);
        } else if (item.isFile()) {
            const buffer = await fs.readFile(fullPath);
            const content = buffer.toString('base64');
            const size = buffer.length;
            entries.push({
                path: relPath,
                type: 'file',
                size,
                content
            });
        }
    }

    return entries;
}

await snapshot();
