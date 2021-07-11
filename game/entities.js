// GUN DEFINITIONS
const combineStats = function(arr) {
    try {
        // Build a blank array of the appropiate length
        let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        arr.forEach(function(component) {
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i] * component[i];
            }
        });
        return {
            reload: data[0],
            recoil: data[1],
            shudder: data[2],
            size: data[3],
            health: data[4],
            damage: data[5],
            pen: data[6],
            speed: data[7],
            maxSpeed: data[8],
            range: data[9],
            density: data[10],
            spray: data[11],
            resist: data[12],
        };
    } catch (err) {
        console.log(err);
        console.log(JSON.stringify(arr));
    }
};
const skillSet = (() => {
    let config = require('../config.json');
    let skcnv = {
        rld: 0,
        pen: 1,
        str: 2,
        dam: 3,
        spd: 4,

        shi: 5,
        atk: 6,
        hlt: 7,
        rgn: 8,
        mob: 9,
    };
    return args => {
        let skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let s in args) {
            if (!args.hasOwnProperty(s)) continue;
            skills[skcnv[s]] = Math.round(config.MAX_SKILL * args[s]);
        }
        return skills;
    };
})();

const g = { // Gun info here 
    trap: [36, 1, 0.25, 0.6, 1, 0.75, 1, 5, 1, 1, 1, 15, 3],
    swarm: [18, 0.25, 0.05, 0.4, 1, 0.75, 1, 4, 1, 1, 1, 5, 1],
    drone: [50, 0.25, 0.1, 0.6, 1, 1, 1, 2, 1, 1, 1, 0.1, 1],
    factory: [60, 1, 0.1, 0.7, 1, 0.75, 1, 3, 1, 1, 1, 0.1, 1],
    basic: [18, 1.4, 0.1, 1, 1, 0.75, 1, 4.5, 1, 1, 1, 15, 1],
    heal: [16, 1.4, 0.1, 1, 1.5, -0.1, 1, 4.5, 1, 0.5, 1, 15, 1],
    potion: [60, 0, 0.1, 0.5, 1, 0.75, 1, 4.5, 1, 0, 1, 5, 1],
};

const dfltskl = 9;

// NAMES
const statnames = {
    smasher: 1,
    drone: 2,
    necro: 3,
    swarm: 4,
    trap: 5,
    generic: 6,
};
const gunCalcNames = {
    default: 0,
    bullet: 1,
    drone: 2,
    swarm: 3,
    fixedReload: 4,
    thruster: 5,
    sustained: 6,
    necro: 7,
    trap: 8,
};

// ENTITY DEFINITIONS
exports.genericEntity = {
    NAME: '',
    LABEL: 'Unknown Entity',
    TYPE: 'unknown',
    DAMAGE_CLASS: 0, // 0: def, 1: food, 2: tanks, 3: obstacles
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: 16,
    INDEPENDENT: false,
    CONTROLLERS: ['doNothing'],
    HAS_NO_MASTER: false,
    MOTION_TYPE: 'glide', // motor, swarm, chase
    FACING_TYPE: 'toTarget', // turnWithSpeed, withMotion, looseWithMotion, toTarget, looseToTarget
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    HITS_OWN_TYPE: 'normal', // hard, repel, never, hardWithBuffer
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    AUTO_UPGRADE: 'none',
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
    GUNS: [],
    MAX_CHILDREN: 0,
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,

        RANGE: 0,
        FOV: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        HETERO: 2,
    },
    FOOD: {
        LEVEL: -1,
    },
};

// FOOD
exports.food = {
    TYPE: 'food',
    DAMAGE_CLASS: 1,
    HITS_OWN_TYPE: 'repel',
    MOTION_TYPE: 'drift',
    FACING_TYPE: 'turnWithSpeed',
    VARIES_IN_SIZE: true,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1,
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
};

const basePolygonDamage = 1;
const basePolygonHealth = 2;
exports.hugePentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 5,
    },
    LABEL: 'Alpha Pentagon',
    VALUE: 15000,
    SHAPE: -5,
    SIZE: 58,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 300 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        SHIELD: 40 * basePolygonHealth,
        REGEN: 0.6,
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
exports.bigPentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 4,
    },
    LABEL: 'Beta Pentagon',
    VALUE: 2500,
    SHAPE: 5,
    SIZE: 30,
    COLOR: 14,
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 30,
        HEALTH: 50 * basePolygonHealth,
        RESIST: Math.pow(1.25, 2),
        SHIELD: 20 * basePolygonHealth,
        REGEN: 0.2,
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
exports.pentagon = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
    },
    ALPHA: 0,
    LABEL: 'Egg',
    VALUE: 0,
    SHAPE: 0,
    SIZE: 0,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 0,
        HEALTH: 0,
        PUSHABILITY: 0,
    },
    DRAW_HEALTH: false,
};
exports.triangle = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 2,
    },
    LABEL: 'Triangle',
    VALUE: 120,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 2,
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 6,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1.15,
        PENETRATION: 1.5,
    },
    DRAW_HEALTH: true,
};
exports.square = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
    },
    ALPHA: 0,
    LABEL: 'Egg',
    VALUE: 0,
    SHAPE: 0,
    SIZE: 0,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 0,
        HEALTH: 0,
        PUSHABILITY: 0,
    },
    DRAW_HEALTH: false,
};
exports.egg = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
    },
    LABEL: 'Egg',
    VALUE: 0,
    SHAPE: 0,
    SIZE: 0,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 0,
        HEALTH: 0,
        PUSHABILITY: 0,
    },
    DRAW_HEALTH: false,
};
exports.arm = {
    PARENT: [exports.food],
    FOOD: {
        LEVEL: 0,
    },
    LABEL: 'Arm',
    VALUE: 10,
    SHAPE: 0,
    SIZE: 5,
    COLOR: 6,
    INTANGIBLE: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 2,
        HEALTH: 0.0011,
        PUSHABILITY: 0,
    },
    DRAW_HEALTH: false,
};

exports.greenpentagon = {
    PARENT: [exports.food],
    LABEL: 'Pentagon',
    VALUE: 30000,
    SHAPE: 5,
    SIZE: 16,
    COLOR: 1,
    BODY: {
        DAMAGE: 3,
        DENSITY: 8,
        HEALTH: 200,
        RESIST: 1.25,
        PENETRATION: 1.1,
    },
    DRAW_HEALTH: true,
};
exports.greentriangle = {
    PARENT: [exports.food],
    LABEL: 'Triangle',
    VALUE: 7000,
    SHAPE: 3,
    SIZE: 9,
    COLOR: 1,
    BODY: {
        DAMAGE: 1,
        DENSITY: 6,
        HEALTH: 60,
        RESIST: 1.15,
        PENETRATION: 1.5,
    },
    DRAW_HEALTH: true,
};

exports.gem = {
    PARENT: [exports.food],
    LABEL: 'Gem',
    VALUE: 2000,
    SHAPE: 6,
    SIZE: 5,
    COLOR: 0,
    BODY: {
        DAMAGE: basePolygonDamage / 4,
        DENSITY: 4,
        HEALTH: 10,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: 0.25,
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
};
exports.cactus = {
    TYPE: 'wall',
    DAMAGE_CLASS: 1,
    LABEL: 'Rock',
    FACING_TYPE: 'turnWithSpeed',
    SHAPE: 0,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 10000,
        SHIELD: 10000,
        REGEN: 1000,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1,
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: 37,
    VARIES_IN_SIZE: true,
    GIVE_KILL_MESSAGE: true,
    ACCEPTS_SCORE: false,
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [15, 0.01, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 30, 0.5, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 60, 0.25, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 90, 0.75, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 120, 0, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 150, 0.5, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 180, 0.25, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 210, 0.75, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 240, 0, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 270, 0.5, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 300, 0.25, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, {
        POSITION: [15, 0.01, 1, 0, 0, 330, 0.75, ],
        PROPERTIES: {
            COLOR: 37
        },
    }, ],
};
exports.obstacle = {
    DAMAGE_CLASS: 1,
    LABEL: 'Rock',
    FACING_TYPE: 'turnWithSpeed',
    SHAPE: -9,
    BODY: {
        RESIST: 100,
        SPEED: 0,
        HEALTH: 10,
        DAMAGE: 2,
        PENETRATION: 0.25,
        FOV: 0.7,
        PUSHABILITY: 0,
        HETERO: 0,
        REGEN: 0.5,
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: 52,
    VARIES_IN_SIZE: true,
    GIVE_KILL_MESSAGE: true,
    ACCEPTS_SCORE: false,
};

// WEAPONS
const wepHealthFactor = 0.5;
const wepDamageFactor = 1.5;
exports.bullet = {
    LABEL: 'Bullet',
    TYPE: 'bullet',
    ACCEPTS_SCORE: false,
    SHAPE: 3,
    BODY: {
        PENETRATION: 5,
        SPEED: 90,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
      GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 27, 1, -30, 0, 0, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, ],
    FACING_TYPE: 'smoothWithMotion',
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: 'never',
    // DIE_AT_LOW_SPEED: true,
    DIE_AT_RANGE: true,
};
exports.gas = {
    LABEL: 'Gas',
    TYPE: 'bullet',
    MOTION_TYPE: 'grow',
    ACCEPTS_SCORE: false,
    SHAPE: 0,
    BODY: {
        PENETRATION: 5,
        SPEED: 90,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    FACING_TYPE: 'smoothWithMotion',
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: 'never',
    // DIE_AT_LOW_SPEED: true,
    DIE_AT_RANGE: true,
};

// TANK CLASSES
const base = {
    ACCEL: 1.6,
    SPEED: 5.25,
    HEALTH: 20,
    DAMAGE: 3,
    RESIST: 1,
    PENETRATION: 1.05,
    SHIELD: 8,
    REGEN: 0.025,
    FOV: 1,
    DENSITY: 0.5,
};
exports.genericTank = {
    LABEL: 'Unknown Class',
    TYPE: 'tank',
    DAMAGE_CLASS: 2,
    DANGER: 5,
    MOTION_TYPE: 'motor',
    FACING_TYPE: 'smoothWithMotion',
    SIZE: 12,
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    BODY: { // def
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED * 2,
        HEALTH: base.HEALTH * 5,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: 0.9,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
}
exports.poisonLiquid = {
    PARENT: [exports.genericTank],
    COLOR: 48,
    GUNS: [],
};
exports.poisonPotion = {
    PARENT: [exports.genericTank],
    LABEL: 'Poison',
    SIZE: 30,
    COLOR: 100,
    GIVE_KILL_MESSAGE: false,
    DANGER: 7,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 120,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 4 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC 
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: [exports.poisonLiquid]
    }, ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [14, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 101
        },
    }, {
        POSITION: [8, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }],
}
exports.iceLiquid = {
    PARENT: [exports.genericTank],
    COLOR: 49,
    GUNS: [],
};
exports.icePotion = {
    PARENT: [exports.genericTank],
    LABEL: 'Ice',
    SIZE: 30,
    GIVE_KILL_MESSAGE: false,
    COLOR: 100,
    DANGER: 7,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 120,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 4 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC 
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: [exports.iceLiquid]
    }, ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [14, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 101
        },
    }, {
        POSITION: [8, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }],
}
exports.invisibleLiquid = {
    PARENT: [exports.genericTank],
    COLOR: 100,
    GUNS: [],
};
exports.invisibiltyPotion = {
    PARENT: [exports.genericTank],
    LABEL: 'Invisibility',
    SIZE: 30,
    COLOR: 100,
    GIVE_KILL_MESSAGE: false,
    DANGER: 7,
      BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 120,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 4 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC 
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: [exports.invisibleLiquid]
    }, ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [14, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 101
        },
    }, {
        POSITION: [8, 9, 1, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }, {
        POSITION: [4, 13, 1, 14, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100
        },
    }],
};
exports.spinner = {
    PARENT: [exports.genericTank],
    LABEL: 'Protector',
    COLOR: 101,
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: ['spin'],
    AI: {
        NO_LEAD: true,
        LIKES_SHAPES: true,
    },
    INDEPENDENT: true,
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [25, 10, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            COLOR: 101,
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [25, 10, 1, 0, 0, 90, 0, ],
        PROPERTIES: {
            COLOR: 101,
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [25, 10, 1, 0, 0, 180, 0, ],
        PROPERTIES: {
            COLOR: 101,
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [25, 10, 1, 0, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 101,
            TYPE: exports.bullet,
        },
    }],
};

exports.gemTop = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 10,
    SHAPE: 4,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [24, 0, 1, 0, 0, 45, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 135, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 225, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 315, 0.5, ],
    }, ],
};

exports.gemBase = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 52,
    SHAPE: 204,
};


exports.gem = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 10,
    SHAPE: 4,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ]
};

exports.crystal = {
    PARENT: [exports.obstacle],
    LABEL: '',
    SHAPE: 204,
    COLOR: 52,
    //CONTROLLERS: ['nearestDifferentMaster'],
     TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC       
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: [exports.gemBase]
    }, { 
        POSITION: [19, 0, 0, 135, 0, 1],
        TYPE: [exports.gem]
    }, {        
        POSITION: [18.5, 0, 0, 135, 0, 1],
        TYPE: [exports.gem]
    }, {        
        POSITION: [10, 0, 0, 135, 0, 1],
        TYPE: [exports.gemTop]
    }, {        
        POSITION: [9.5, 0, 0, 135, 0, 1],
        TYPE: [exports.gemTop]
    }, {        
        POSITION: [9, 0, 0, 135, 0, 1],
        TYPE: [exports.gemTop]
    }, {        
        POSITION: [8.5, 0, 0, 135, 0, 1],
        TYPE: [exports.gemTop]
    }, ],
};

exports.redgemTop = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 12,
    SHAPE: 4,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [24, 0, 1, 0, 0, 45, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 135, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 225, 0.5, ],
    }, {
        POSITION: [24, 0, 1, 0, 0, 315, 0.5, ],
    }, ],
};

exports.redgemBase = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 52,
    SHAPE: 204,
};


exports.redgem = {
    PARENT: [exports.genericTank],
    LABEL: '',
    COLOR: 12,
    SHAPE: 4,
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ]
};

exports.redcrystal = {
    PARENT: [exports.obstacle],
    LABEL: '',
    SHAPE: 204,
    COLOR: 52,
    //CONTROLLERS: ['nearestDifferentMaster'],
     TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC       
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: [exports.redgemBase]
    }, { 
        POSITION: [19, 0, 0, 135, 0, 1],
        TYPE: [exports.redgem]
    }, {        
        POSITION: [18.5, 0, 0, 135, 0, 1],
        TYPE: [exports.redgem]
    }, {        
        POSITION: [10, 0, 0, 135, 0, 1],
        TYPE: [exports.redgemTop]
    }, {        
        POSITION: [9.5, 0, 0, 135, 0, 1],
        TYPE: [exports.redgemTop]
    }, {        
        POSITION: [9, 0, 0, 135, 0, 1],
        TYPE: [exports.redgemTop]
    }, {        
        POSITION: [8.5, 0, 0, 135, 0, 1],
        TYPE: [exports.redgemTop]
    }, ],
};

exports.baseWall = {
    PARENT: [exports.obstacle],
    LABEL: '',
    SHAPE: 4,
    TYPE: 'wall',
};

exports.mazeWall = {
    PARENT: [exports.genericTank],
    LABEL: 'Windmill',
    COLOR: 40,
    TYPE: 'wall',
    CONTROLLERS: ['alwaysFire'],
    SIZE: 64,
    SHAPE: 4,
    ACCEPTS_SCORE: false,
    //CONTROLLERS: ['nearestDifferentMaster'],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.square, { INDEPENDENT: true, COLOR: 100, }]
    }, {        
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: exports.spinner,
  }, ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [0, 8, 1, 0, 0, 0, 2, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.potion]),
            AUTOFIRE: true,
            MAX_CHILDREN: 1,
            TYPE: exports.poisionPotion,
        },
    }, {
        POSITION: [0, 8, 1, 0, 0, 90, 2, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.potion]),
            AUTOFIRE: true,
            MAX_CHILDREN: 1,
            TYPE: exports.icePotion,
        },
    }, {
        POSITION: [0, 8, 1, 0, 0, 180, 2, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.potion]),
            MAX_CHILDREN: 1,
            TYPE: exports.invisibiltyPotion,
        },
    }, {
        POSITION: [0, 8, 1, 0, 0, 270, 2, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.potion]),
            AUTOFIRE: true,
            TYPE: exports.bullet,
        },
    }],
}
exports.healerIndicator = {
    PARENT: [exports.genericTank],
    LABEL: 'Healer Indicator',
    COLOR: 12,
    SHAPE: [
        [-1.5, 0],
        [-1.5, -0.5],
        [-0.5, -0.5],
        [-0.5, -1.5],
        [0.5, -1.5],
        [0.5, -0.5],
        [1.5, -0.5],
        [1.5, 0.5],
        [0.5, 0.5],
        [0.5, 1.5],
        [-0.5, 1.5],
        [-0.5, 0.5],
        [-1.5, 0.5],
        [-1.5, 0],
    ],
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [],
};
exports.heal = {
    PARENT: [exports.genericTank],
    LABEL: 'Healing Station',
    SIZE: 30,
    COLOR: 100,
    CONTROLLERS: ['spin'],
    DANGER: 7,
    TURRETS: [{ //  SIZE     X       Y     ANGLE    ARC 
        POSITION: [7, 0, 0, 0, 0, 1],
        TYPE: [exports.healerIndicator]
    }, ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [7, 11, 0.6, 7, 0, 0, 0, ],
        PROPERTIES: {
            COLOR: 100,
            SHOOT_SETTINGS: combineStats([g.heal]),
            TYPE: exports.gas,
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.sustained,
        },
    }, {
        POSITION: [7, 11, 0.6, 7, 0, 90, 0, ],
        PROPERTIES: {
            COLOR: 100,
            SHOOT_SETTINGS: combineStats([g.heal]),
            TYPE: exports.gas,
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.sustained,
        },
    }, {
        POSITION: [7, 11, 0.6, 7, 0, 180, 0, ],
        PROPERTIES: {
            COLOR: 100,
            SHOOT_SETTINGS: combineStats([g.heal]),
            TYPE: exports.gas,
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.sustained,
        },
    }, {
        POSITION: [7, 11, 0.6, 7, 0, 270, 0, ],
        PROPERTIES: {
            COLOR: 100,
            SHOOT_SETTINGS: combineStats([g.heal]),
            TYPE: exports.gas,
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.sustained,
                }, },
        ],
};

function makeAuto(type, name = -1, options = {}) {
    let turret = {
        type: exports.autoTurret,
        size: 10,
        independent: true,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.size != null) {
        turret.size = options.size;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }

    let output = JSON.parse(JSON.stringify(type));
    let autogun = {
        /*********  SIZE               X       Y     ANGLE    ARC */
        POSITION: [turret.size, 0, 0, 180, 360, 1, ],
        TYPE: [turret.type, {
            CONTROLLERS: ['nearestDifferentMaster'],
            INDEPENDENT: turret.independent,
        }],
    };
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [autogun];
    } else {
        output.TURRETS = [...type.TURRETS, autogun];
    }
    if (name == -1) {
        output.LABEL = 'Auto-' + type.LABEL;
    } else {
        output.LABEL = name;
    }
    output.DANGER = type.DANGER + 1;
    return output;
}

function makeHybrid(type, name = -1) {
    let output = JSON.parse(JSON.stringify(type));
    let spawner = {
        /********* LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [7, 12, 1.2, 8, 0, 180, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: [exports.drone, {
                INDEPENDENT: true,
            }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: false,
            MAX_CHILDREN: 3,
        },
    };
    if (type.TURRETS != null) {
        output.TURRETS = type.TURRETS;
    }
    if (type.GUNS == null) {
        output.GUNS = [spawner];
    } else {
        output.GUNS = [...type.GUNS, spawner];
    }
    if (name == -1) {
        output.LABEL = 'Hybrid ' + type.LABEL;
    } else {
        output.LABEL = name;
    }
    return output;
}

exports.basic = {
    PARENT: [exports.genericTank],
    LABEL: '',
    LEVEL: 45,
    BODY: {
        PENETRATION: 5,
        SPEED: 7,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ],
};

exports.redbasic = {
    PARENT: [exports.genericTank],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.arm, {
            COLOR: 44,
        }],
    }, ],
};

exports.orangebasic = {
    PARENT: [exports.genericTank],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],   
    TURRETS: [{
      /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.arm, {
            COLOR: 45,
        }],
    }, ],
};

exports.yellowskin = {
    PARENT: [exports.genericTank],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.arm, {
            COLOR: 46,
        }],
    }, ],
};

exports.neonskin = {
    PARENT: [exports.genericTank],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.arm, {
            COLOR: 47,
        }],
    }, ],
};

exports.bluebasic = {
    PARENT: [exports.genericTank],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [20, 0, 0, 0, 360, 1],
        TYPE: [exports.arm, {
            COLOR: 43,
        }],
    }, ],
};

exports.leader = {
    PARENT: [exports.genericTank],
    SIZE: 70,
    NAME: "LEADER",
    CONTROLLERS: ['nearestDifferentMaster', 'minion', 'canRepel'],
    LABEL: '',
    //CONTROLLERS: ['nearestDifferentMaster'],
    //CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [{
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
      TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ],
};
exports.pistolPicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Pistol Picture',
    SHAPE: [
        [1000000000000000, 229400000000000000]
    ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, ],
};
exports.pistol = {
    PARENT: [exports.genericTank],
    LABEL: '',
    BODY: {
        PENETRATION: 5,
        SPEED: 7,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ]
};
exports.dualPicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Dual Picture',
    SHAPE: [
        [1000000000000000, 229400000000000000]
    ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, -5, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [20, 3, 1, 0, 5, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
      },
    }, ],
};
exports.dual = {
    PARENT: [exports.genericTank],
    LABEL: '',
    BODY: {
        PENETRATION: 5,
        SPEED: 7,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, -5, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [20, 3, 1, 0, 5, 0, 0.5, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ]
};
exports.riflePicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Rifle Picture',
    SHAPE: [
        [1000000000000000, 229400000000000000]
    ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  20,    10,    1,      0,      0,      0,      0,   ], 
        }, {
        POSITION: [  24,     5,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
            TYPE: exports.bullet,
      },
    }, ],
};
exports.rifle = {
    PARENT: [exports.genericTank],
    LABEL: '',
    BODY: {
        PENETRATION: 5,
        SPEED: 7,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  20,    10,    1,      0,      0,      0,      0,   ], 
        }, {
        POSITION: [  24,     5,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
            TYPE: exports.bullet,
        },
    }, {
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 2, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 11, 0, 16, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ]
};
exports.shotgunPicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Shotgun Picture',
    SHAPE: [
        [1000000000000000, 229400000000000000]
    ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [  15,    10,    1,      0,      0,      0,      0,   ], 
        }, {
        POSITION: [  24,     5,      1,      0,      0,      0,      0,   ], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
            TYPE: exports.bullet,
      },
    }, ],
};
exports.shotgun = {
    PARENT: [exports.genericTank],
    LABEL: '',
    BODY: {
        PENETRATION: 5,
        SPEED: 7,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.33 * wepHealthFactor,
        DAMAGE: 10 * wepDamageFactor,
        PUSHABILITY: 0.3,
    },
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, -5, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
        POSITION: [20, 3, 1, 0, 5, 0, 0.5, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, {
      POSITION: [12, 15, 1, -6, 0, 0, 0, ],
      PROPERTIES: {
          COLOR: 100
      },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ]
};
exports.sniperPicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Sniper Picture',
    SHAPE: [
        [1000000000000000, 229400000000000000]
    ],
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [33, 3, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
            TYPE: exports.bullet,
        },
    }, ],
};
exports.stonePicture = {
    PARENT: [exports.genericTank],
    LABEL: 'Stone Picture',
    SHAPE: 6
};
exports.stone = {
    PARENT: [exports.genericTank],
    LABEL: '',
    GUNS: [{
        /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
        POSITION: [20, 3, 1, 0, 0, 0, 0, ],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: exports.bullet,
        },
    }, ],
    TURRETS: [{
        /*  SIZE     X       Y     ANGLE    ARC */
        POSITION: [9, 10, 0, 320, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, {
        POSITION: [9, 10, 0, 40, 360, 0],
        TYPE: [exports.arm, {
            COLOR: 38,
        }],
    }, ]
};

// UPGRADE PATHS
exports.basic.UPGRADES_TIER_1 = [exports.pistolPicture, exports.dualPicture, exports.riflePicture, exports.shotgunPicture, exports.pistolPicture];

exports.pistol.UPGRADES_TIER_1 = [exports.pistolPicture, exports.dualPicture, exports.pistolPicture, exports.pistolPicture, exports.pistolPicture];
exports.dualPicture.UPGRADES_TIER_1 = [];

exports.bot = {
    AUTO_UPGRADE: 'random',
    FACING_TYPE: 'looseToTarget',
    BODY: {
        SIZE: 12,
    },
    NAME: "",
    CONTROLLERS: [
        'nearestDifferentMaster', 'mapAltToFire', 'minion', 'fleeAtLowHealth'
    ],
    AI: {
        STRAFE: true,
    },
};
