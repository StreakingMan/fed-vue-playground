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
    private canvasInfo: CanvasInfo;
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
        if (!command) return;
    }
}
