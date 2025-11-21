interface ScreepsConfig {
    common: {
        constants: {
            CONSTRUCTION_COST: Record<string, number>;
            CONTROLLER_LEVELS: Record<number, number>;
        };
    };
    custom?: any;
    engine?: {
        resetAll: () => void;
        start: () => void;
        stop: () => void;
    };
    cli: {
        on: (command: string, fn: (args: any, callback: (msg: string) => void) => void) => void;
    };
}

interface DefaultConstantSet {
    CONSTRUCTION_COST: Record<string, number>;
    CONTROLLER_LEVELS: Record<number, number>;
}

const NEW_CONSTANTS: DefaultConstantSet = {
    CONSTRUCTION_COST: {
        "spawn": 1500,
        "extension": 300,
        "road": 30,
        "constructedWall": 1,
        "rampart": 1,
        "link": 500,
        "storage": 3000,
        "tower": 500,
        "observer": 800,
        "powerSpawn": 10000,
        "extractor": 500,
        "lab": 5000,
        "terminal": 10000,
        "container": 500,
        "nuker": 10000,
        "factory": 10000
    },
    CONTROLLER_LEVELS: {
        1: 200,
        2: 4500,
        3: 13500,
        4: 40500,
        5: 121500,
        6: 364500,
        7: 1093500
    }
};

// Utility to reload engine safely
function restartEngine(config: ScreepsConfig, message: string, callback: (msg: string) => void) {
    try {
        config.engine?.resetAll();
        config.engine?.stop?.();
        config.engine?.start?.();
        callback(`✔ ${message} (Engine reloaded)`);
    } catch {
        callback(`⚠ ${message} (Restart manually: use "system.reset All")`);
    }
}

module.exports = function(config: ScreepsConfig) {
    const constants = config.common.constants;

    config.custom = config.custom ?? {};
    config.custom.constChanges = config.custom.constChanges ?? {
        original: {
            CONSTRUCTION_COST: { ...constants.CONSTRUCTION_COST },
            CONTROLLER_LEVELS: { ...constants.CONTROLLER_LEVELS }
        },
        current: {
            CONSTRUCTION_COST: { ...NEW_CONSTANTS.CONSTRUCTION_COST },
            CONTROLLER_LEVELS: { ...NEW_CONSTANTS.CONTROLLER_LEVELS }
        }
    };

    // Apply modified constants to runtime engine
    Object.assign(constants.CONSTRUCTION_COST, config.custom.constChanges.current.CONSTRUCTION_COST);
    Object.assign(constants.CONTROLLER_LEVELS, config.custom.constChanges.current.CONTROLLER_LEVELS);

    // ============================
    // CLI COMMANDS
    // ============================

    config.cli.on("constants", (args, callback) => {
        const action = args._[0];
        const prop = args._[1];
        const rawValue = args._[2];

        if (!action) {
            callback(`Usage:
constants get <path>
constants set <path> <value>
constants reset
constants reload`);
            return;
        }

        // GET
        if (action === "get") {
            if (!prop) {
                callback(JSON.stringify(constants, null, 2));
                return;
            }
            try {
                const value = eval(`config.common.constants.${prop}`);
                callback(JSON.stringify(value, null, 2));
            } catch {
                callback(`Invalid property path: ${prop}`);
            }
            return;
        }

        // SET
        if (action === "set") {
            if (!prop || rawValue === undefined) {
                callback(`Usage: constants set <path> <value>`);
                return;
            }
            try {
                const parsedValue = JSON.parse(rawValue);
                eval(`config.custom.constChanges.current.${prop} = parsedValue`);
                callback(`Updated ${prop} to ${rawValue}. Use "constants reload" to apply.`);
            } catch {
                callback(`Failed to parse value. Must be valid JSON (e.g. 300 or "[1,2]")`);
            }
            return;
        }

        // RESET
        if (action === "reset") {
            config.custom.constChanges.current = {
                CONSTRUCTION_COST: { ...config.custom.constChanges.original.CONSTRUCTION_COST },
                CONTROLLER_LEVELS: { ...config.custom.constChanges.original.CONTROLLER_LEVELS }
            };
            restartEngine(config, `Restored original Screeps defaults`, callback);
            return;
        }

        // LIVE RELOAD / APPLY CHANGES
        if (action === "reload") {
            Object.assign(constants.CONSTRUCTION_COST, config.custom.constChanges.current.CONSTRUCTION_COST);
            Object.assign(constants.CONTROLLER_LEVELS, config.custom.constChanges.current.CONTROLLER_LEVELS);
            restartEngine(config, "Applied custom constant changes", callback);
            return;
        }

        callback(`Unknown command "${action}". Try: get, set, reset, reload`);
    });
};
