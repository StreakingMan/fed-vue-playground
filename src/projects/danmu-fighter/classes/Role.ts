import { MiniEngine } from './MiniEngine';

interface CanvasInfo {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
}

interface RoleOptions {
    canvasInfo: CanvasInfo;
}

export class Role {
    public canvasInfo: CanvasInfo;
    private commandList: string[] = [];
    private engine: MiniEngine;
    constructor(engine: MiniEngine, options: RoleOptions) {
        this.canvasInfo = options.canvasInfo;
        this.engine = engine;
    }
    addCommand(command: string): string[] {
        this.commandList.push(command);
        return this.commandList;
    }
    moveLeft(): void {
        //this.canvasInfo.x + this.
    }
    tick(): void {
        const command = this.commandList.pop();
        console.log(command);
        if (!command) return;

        switch (command) {
            case '上':
                this.canvasInfo.y -= this.engine.unit;
                break;
            case '下':
                this.canvasInfo.y += this.engine.unit;
                break;
            case '左':
                this.canvasInfo.x -= this.engine.unit;
                break;
            case '右':
                this.canvasInfo.x += this.engine.unit;
                break;
        }
    }
}
