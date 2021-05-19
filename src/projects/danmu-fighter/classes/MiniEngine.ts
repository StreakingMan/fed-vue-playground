import { Role } from './Role';

interface MiniEngineOptions {
    globalWidth: number;
    globalHeight: number;
    intervalTime: number;
    unit: number;
}

export class MiniEngine {
    public globalWidth = 1000;
    public globalHeight = 1000;
    public roleList: Role[] = [];
    private readonly intervalTime: number = 1000;
    private interval: number | undefined;
    private unit = 50;

    constructor({
        globalWidth = 1000,
        globalHeight = 1000,
        intervalTime = 1000,
        unit = 1000,
    }: MiniEngineOptions) {
        this.globalWidth = globalWidth;
        this.globalHeight = globalHeight;
        this.intervalTime = intervalTime;
        this.unit = unit;
    }

    addRole(role: Role): Role[] {
        this.roleList.push(role);
        return this.roleList;
    }

    start(): void {
        this.interval = setInterval(() => {
            for (const role of this.roleList) {
                role.tick();
            }
        }, this.intervalTime);
    }

    stop(): void {
        clearInterval(this.interval);
    }
}
