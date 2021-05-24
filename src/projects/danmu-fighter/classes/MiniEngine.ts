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
    public unit = 50;
    public status: 'STOP' | 'START' | 'PAUSE' = 'STOP';

    constructor({
        globalWidth = 1000,
        globalHeight = 1000,
        intervalTime = 1000,
        unit = 100,
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
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        this.interval = setInterval(() => {
            for (const role of this.roleList) {
                role.tick();
                this.testBomb();
            }
        }, this.intervalTime);

        this.status = 'START';
    }

    stop(): void {
        clearInterval(this.interval);
        this.status = 'STOP';
        this.clearRoleCommand();
    }

    // 清空角色指令
    clearRoleCommand(roles?: Role[]): void {
        if (roles?.length) {
            roles.forEach((role) => {
                role.clearCommand();
                role.clearCommandCache();
            });
        } else {
            this.roleList.forEach((role) => {
                role.clearCommand();
                role.clearCommandCache();
            });
        }
    }

    // 边界检测
    testEdge(role: Role): boolean {
        const { x, y, w, h } = role.canvasInfo;
        return (
            x < 0 ||
            y < 0 ||
            x + w > this.globalWidth ||
            y + h > this.globalHeight
        );
    }

    // 碰撞检测
    testBomb(): void {
        const bombedRole: Role[] = [];
        this.roleList.forEach((role) => {
            const { x, y, w, h } = role.canvasInfo;

            const bombed = this.roleList
                .filter((r) => !bombedRole.includes(r) && r.name !== role.name)
                .filter(
                    (r) =>
                        // 两角色不重叠情况取反即重叠
                        !(
                            r.canvasInfo.y + r.canvasInfo.h <= y ||
                            r.canvasInfo.y >= y + h ||
                            r.canvasInfo.x + r.canvasInfo.w <= x ||
                            r.canvasInfo.x >= x + w
                        )
                );

            if (bombed.length) {
                bombedRole.push(role);
                bombedRole.push(...bombed);
            }
        });

        bombedRole.forEach((r) => {
            const cmdCache: string = r.getTopCommandCache();
            if (!cmdCache) return;
            const bombMap = {
                ['左']: '右',
                ['右']: '左',
                ['上']: '下',
                ['下']: '上',
            };
            // @ts-ignore
            r.addTopCommands(['', '', bombMap[cmdCache]]);
        });
    }
}
