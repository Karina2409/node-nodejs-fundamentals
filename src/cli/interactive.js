import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const interactive = async () => {
    try {
        while (true) {
            const command = (await rl.question('> ')).trim().toLowerCase();
            switch (command) {
                case 'uptime':
                    const uptime = process.uptime().toFixed(2);
                    console.log(`Uptime: ${uptime}s`);
                    break;
                case 'cwd':
                    console.log(`${process.cwd()}`);
                    break;
                case 'date':
                    const now = new Date();
                    console.log(now.toISOString());
                    break;
                case 'exit':
                    console.log('Goodbye!');
                    return;
                default:
                    console.log(`Unknown command`);
                    break;
            }
        }
    } catch (err) {
        console.log('\nGoodbye!');
    } finally {
        rl.close();
    }
};

await interactive();
