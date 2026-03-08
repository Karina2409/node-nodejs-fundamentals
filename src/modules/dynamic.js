import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginName = process.argv[2];

if (!pluginName) {
    console.log('Plugin not found');
    process.exit(1);
}

const pluginPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'plugins',
    `${pluginName}.js`
);

const dynamic = async () => {
    try {

        console.log(pluginPath)

        const pluginModule = await import(`file://${pluginPath}`);
        const result = await pluginModule.run();
        console.log(result);
    } catch (err) {
        console.error('Plugin not found');
        process.exit(1);
    }
};

await dynamic();
