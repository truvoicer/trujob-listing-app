export class AppManager {
    debug = false;
    constructor() {
        this.setDebug(
            process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
        )
    }

    setDebug(debug) {
        this.debug = debug;
    }

    isDebug() {
        return this.debug;
    }

    static getInstance() {
        return new AppManager();
    }

}
