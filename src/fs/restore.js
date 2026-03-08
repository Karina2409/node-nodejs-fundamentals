import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const restore = async () => {
    const snapshotFile = path.join(process.cwd(), 'snapshot.json');
    const restoredDir = path.join(process.cwd(), 'workspace_restored');

    try {
        await fs.access(snapshotFile);

        try {
            await fs.access(restoredDir);
            throw new Error('FS operation failed');
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }

        const content = await fs.readFile(snapshotFile, 'utf-8');
        const snapshot = JSON.parse(content);

        if (!snapshot.entries || !Array.isArray(snapshot.entries)) {
            throw new Error('FS operation failed');
        }
        await fs.mkdir(restoredDir, { recursive: true });

        for (const entry of snapshot.entries) {
            const targetPath = path.join(restoredDir, entry.path);
            if (entry.type === 'directory') {
                await fs.mkdir(targetPath, { recursive: true });
            } else if (entry.type === 'file') {
                await fs.mkdir(path.dirname(targetPath), { recursive: true });
                const fileContent = Buffer.from(entry.content, 'base64');
                await fs.writeFile(targetPath, fileContent);
            }
        }
    } catch (err) {
        throw new Error('FS operation failed');
    }
};

await restore();
