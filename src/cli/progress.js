import process from 'node:process';

const progress = () => {
    const args = process.argv.slice(2);

    const params = {
        duration: 5000,
        interval: 100,
        length: 30,
        color: null
    }

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];

        if (key === '--duration' && value) params.duration = parseInt(value, 10);
        if (key === '--interval' && value) params.interval = parseInt(value, 10);
        if (key === '--length' && value) params.length = parseInt(value, 10);
        if (key === '--color' && value) params.color = value;

        if (isNaN(params.duration) || params.duration <= 0) params.duration = 5000;
        if (isNaN(params.interval) || params.interval <= 0) params.interval = 100;
        if (isNaN(params.length) || params.length <= 0) params.length = 30;
    }

    const totalSteps = Math.ceil(params.duration / params.interval);
    let step = 0;

    const intervalId = setInterval(() => {
        drawBar(params, totalSteps, step);
        step++;

        if (step >= totalSteps) {
            clearInterval(intervalId);
            process.stdout.write('\r' + ' '.repeat(100) + '\r');
            console.log('Done!');
            process.exit(0);
        }
    }, params.interval);
};

const drawBar = (params, totalSteps, step) => {
    const colorValid = params.color && /^#[0-9A-Fa-f]{6}$/.test(params.color);
    const colorCode = colorValid ? `\x1b[38;2;${parseInt(params.color.slice(1,3),16)};${parseInt(params.color.slice(3,5),16)};${parseInt(params.color.slice(5,7),16)}m` : '';
    const reset = '\x1b[0m';

    const percent = Math.min(100, Math.round((step / totalSteps) * 100));
    const filled = Math.round((params.length * percent) / 100);
    const empty = params.length - filled;

    const bar =
        '[' +
        colorCode +
        '█'.repeat(filled) +
        reset +
        ' '.repeat(empty) +
        '] ' +
        percent.toString().padStart(3) + '%';

    process.stdout.write('\r' + bar);
};

progress();
