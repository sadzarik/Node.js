import * as os from "node:os";
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import * as si from 'systeminformation';

import * as promptSync from 'prompt-sync';

const prompt = promptSync();

// Task 1
async function runSequent<T, K>(array: T[], callback: (item: T, index: number) => Promise<K>): Promise<K[]> {
    const results: K[] = [];
    for (let i = 0; i < array.length; i++) {
        const result = await callback(array[i], i);
        results.push(result);
    }

    return results;
}
const show = async () => {
    const array: Array<string> = ["one", "two", "three"];
    const results = await runSequent(array, (item, index) =>
        Promise.resolve({
            item,
            index,
        })
    );
    console.log(results);
}

//show()

// Task 2
const arrayChangeDelete = <T>(array: T[], rule: (item: T) => boolean): T[] => {
    const deletedElements: T[] = [];

    for (let i = array.length - 1; i >= 0; i--) {
        if (rule(array[i]))
            deletedElements.push(...array.splice(i, 1));
    }

    return deletedElements;
}

/*
const array = [1, 2, 3, 6, 7, 9];
const deletedElements = arrayChangeDelete(array, (item) => item % 2 === 0);
console.log(array);
console.log(deletedElements);

*/

// Task 3

const getContent = () => {
    const fileName: string = prompt(`Type your file name: `);

    fs.readFile(fileName, `utf-8`, (err, data) => {
        const urls = JSON.parse(data) as string[];
        const outputDirName = path.parse(fileName).name + "_pages";

        if (!fs.existsSync(outputDirName)) {
            fs.mkdirSync(outputDirName);
        }

        urls.forEach((url, index) => {
            const outputFileName = path.join(outputDirName, `page_${index}.html`);

            https
                .get(url, res => {
                    const fileStream = fs.createWriteStream(outputFileName);
                    res.pipe(fileStream);

                    fileStream.on("finish", () => console.log(`Page saved to ${outputFileName}`));
                })
                .on(`error`, (err) => console.log(err));
        });

    });
};

// getContent();

// Task 4

const frequency = prompt(`Type frequency: `);

setInterval(async () => {
    const mem = await si.mem();
    const system = await si.osInfo();
    const graphics = await si.graphics();
    const cpuTemperature = await si.cpuTemperature();
    const battery = await si.battery();

    console.log("Operating system:", system.distro);
    console.log("Architecture:", os.arch());
    console.log("Current user name:", os.userInfo().username);
    console.log("CPU Cores Models:");
    const cpuInfo = os.cpus();
    cpuInfo.forEach((core) => {
        console.log(`- ${core.model}`);
    });
    console.log("CPU temperature:", `${cpuTemperature.main} °C`);

    console.log("Total memory:", mem.total);
    console.log("Used memory:", mem.used);
    console.log("Free memory:", mem.free);

    console.log("Battery remaining time:", battery.timeRemaining);
    console.log("Battery percent: ", battery.percent);
    console.log("Battery charging: ", battery.isCharging ? "Yes" : "No");

    graphics.controllers.forEach(controller =>
        console.log(`Graphic controller: ${controller.vendor}`));

}, frequency);


// Task 5

class MyEventEmitter<T> {
    private readonly listeners: Map<string, ((args?: T) => void)[]> = new Map();

    registerHandler(name: string, listener: (args?: T) => void) {
        const listeners = this.listeners.get(name);
        if (!listeners)
            this.listeners.set(name, [listener]);
        else
            listeners.push(listener);
    }

    emitEvent(name: string, args?: T) {
        const listeners = this.listeners.get(name);
        if (listeners)
            listeners.forEach(listener => listener(args));
    }

}

/*
const emitter = new MyEventEmitter();
emitter.registerHandler('userUpdated', () => console.log('Обліковий запис користувача оновлено'));
emitter.emitEvent('userUpdated'); // Обліковий запис користувача оновлено
 */
