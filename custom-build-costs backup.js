// FAST BUILD REDUCED CONSTRUCTION COSTS & CONTROLLER UPGRADE REQUIREMENTS
// Everything is reduced by one significant digit
// ================EXAMPLES================
// Extensions: (3,000) -> 300
// Roads: (300) -> 30
// Observers: (8,000) -> 800
// Controller Level 2->3: (45,000) -> 4,500
// Controller Level 5->6: (1,215,000) -> 121,500
// Controller Level 7->8: (10,935,000) -> 1,093,500

module.exports = function (config) {
	const { constants } = config.common;
	
	// Store default values
	config.custom = config.custom || {};
	if (!config.custom.constChanges) {
		config.custom.constChanges = {
			CONSTRUCTION_COST: { ...constants.CONSTRUCTION_COST },
			CONTROLLER_LEVELS: [ ...constants.CONTROLLER_LEVELS ],
		};
	}
	
	// Apply stored configuration to overwrite engine constnats
	Object.assign(constants.CONSTRUCTION_COST, config.custom.constChanges.CONSTRUCTION_COST);
    Object.assign(constants.CONTROLLER_LEVELS, config.custom.constChanges.CONTROLLER_LEVELS);
	
	// ======= CLI COMMANDS =======
	config.cli.on('constants', (args, callback) => {
		if (!args._[0]) {
			callback(`Usage: constants [set|get] <prop> [value]`);
			return;
		}
		
		const cmd = args._[0];
		
		// example: constants get CONSTRUCTION_COST.wall
		if (cmd === 'get') {
			const prop = args._[1];
			const value = prop ? eval(`constants.${prop}`) : constants;
			callback(JSON.stringify(value, null, 2));
			return;
		}
		
		// example: constants set CONSTRUCTION_COST.wall 300
		if (cmd === 'set') {
			const prop = args._[1];
			const value = JSON.parse(args._[2]); // parse number/array/Object
			
			eval(`config.custom.constChanges.${prop} = value`);
			callback(`Updated ${prop} to ${args._[2]}`);
			return;
		}
		
		callback(`Unknown command. Use constants [set|get]`);
	});
};
    if(config.common) {	
		config.common.constants.CONSTRUCTION_COST = {
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
		config.common.constants.CONTROLLER_LEVELS = {
			1: 200, 
			2: 4500,
			3: 13500,
			4: 40500,
			5: 121500, 
			6: 364500, 
			7: 1093500
		}
	}
}