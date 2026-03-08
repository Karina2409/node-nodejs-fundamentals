import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';

const verify = async () => {
    const checksumFile = path.join(process.cwd(), 'checksums.json');

    try {
        const jsonContent = await fs.readFile(checksumFile, 'utf-8');
        const expectedHashes = JSON.parse(jsonContent);

        if (typeof expectedHashes !== 'object' || expectedHashes === null) {
            throw new Error('FS operation failed');
        }

        for (const [filename, expectedHash] of Object.entries(expectedHashes)) {
            const filePath = path.join(process.cwd(), filename);

            await fs.access(filePath);

            const hash = crypto.createHash('sha256');
            const stream = fsSync.createReadStream(filePath);

            for await (const chunk of stream) {
                hash.update(chunk);
            }

            const actualHash = hash.digest('hex');

            if (actualHash === expectedHash) {
                console.log(`${filename} — OK`);
            } else {
                console.log(`${filename} — FAIL`);
            }
        }
    } catch {
        throw new Error('FS operation failed');
    }
};

await verify();
