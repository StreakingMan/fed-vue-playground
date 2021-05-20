import { MiniEngine } from './MiniEngine';

interface CanvasInfo {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    r?: number;
}

interface RoleOptions {
    name: string;
    canvasInfo: CanvasInfo;
}

export class Role {
    public name: string;
    public canvasInfo: CanvasInfo;
    private commandList: string[] = [];
    private commandCache: string[] = [];
    private engine: MiniEngine;
    constructor(engine: MiniEngine, options: RoleOptions) {
        this.canvasInfo = options.canvasInfo;
        this.name = options.name;
        this.engine = engine;
    }
    getCommandCache(): string[] {
        return this.commandCache;
    }
    getTopCommandCache(): string {
        return this.commandCache[this.commandCache.length - 1];
    }
    addCommand(command: string): string[] {
        this.commandList.unshift(command);
        return this.commandList;
    }
    addTopCommand(command: string): string[] {
        this.commandList.push(command);
        return this.commandList;
    }
    addCommands(commands: string[]): string[] {
        this.commandList.unshift(...commands);
        return this.commandList;
    }
    addTopCommands(commands: string[]): string[] {
        this.commandList.push(...commands);
        return this.commandList;
    }
    clearCommand(): void {
        this.commandList = [];
    }
    clearCommandCache(): void {
        this.commandCache = [];
    }
    // 边缘反弹
    edgeBump(bumpCmd: string): void {
        if (this.engine.testEdge(this)) {
            this.commandList.pop();
            this.commandList.push(...[bumpCmd, '', '', '', '']);
        }
    }
    // 人物碰撞
    // 基础指令
    moveLeft(): void {
        this.canvasInfo.x -= this.engine.unit;
        this.canvasInfo.r = -90;
        this.edgeBump('右');
    }
    moveRight(): void {
        this.canvasInfo.x += this.engine.unit;
        this.canvasInfo.r = 90;
        this.edgeBump('左');
    }
    moveUp(): void {
        this.canvasInfo.y -= this.engine.unit;
        this.canvasInfo.r = 0;
        this.edgeBump('下');
    }
    moveDown(): void {
        this.canvasInfo.y += this.engine.unit;
        this.canvasInfo.r = 180;
        this.edgeBump('上');
    }
    // 拓展指令
    // 帧
    tick(): void {
        const command = this.commandList.pop();
        if (!command) return;

        this.commandCache.push(command);
        if (this.commandCache.length > 5) {
            this.commandCache.shift();
        }
        switch (command) {
            case '上':
                this.moveUp();
                break;
            case '下':
                this.moveDown();
                break;
            case '左':
                this.moveLeft();
                break;
            case '右':
                this.moveRight();
                break;
        }
    }
}
