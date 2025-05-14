
export type DebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'intense';

export class DebugHelpers {
    static ERROR: DebugLevel = 'error';
    static WARN: DebugLevel = 'warn';
    static INFO: DebugLevel = 'info';
    static DEBUG: DebugLevel = 'debug';
    static INTENSE: DebugLevel = 'intense';

    static levels: Array<DebugLevel> = [
        DebugHelpers.ERROR,
        DebugHelpers.WARN,
        DebugHelpers.INFO,
        DebugHelpers.DEBUG,
        DebugHelpers.INTENSE,
    ];

    static debug: boolean = false;
    static debugLevel: DebugLevel = DebugHelpers.INFO;

    static {

        DebugHelpers.debug = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

        const debugLevel = process.env.NEXT_PUBLIC_DEBUG_LEVEL;
        if (debugLevel && DebugHelpers.levels.includes(debugLevel as DebugLevel)) {
            DebugHelpers.debugLevel = debugLevel as DebugLevel;
        } else {
            DebugHelpers.debugLevel = DebugHelpers.INFO;
        }
    }

    static isDebug() {
        return this.debug;
    }

    static isDebugLevel(level: DebugLevel) {
        return this.debug && this.debugLevel === level;
    }

    static log(level: DebugLevel, ...message: Array<any>) {
        if (DebugHelpers.debug) {
            const logLevel = DebugHelpers.debugLevel;
            const currentLevelIndex = DebugHelpers.levels.indexOf(logLevel);
            const messageLevelIndex = DebugHelpers.levels.indexOf(level);

            if (messageLevelIndex <= currentLevelIndex) {
                switch (level) {
                    case 'error':
                        console.error(...message);
                        break;
                    case 'warn':
                        console.warn(...message);
                        break;
                    case 'info':
                    case 'debug':
                        console.log(...message);
                        break;
                }
            }
        }
    }
}