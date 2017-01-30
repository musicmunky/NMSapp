/************************************************************************/
// you will need to set CONTAINERS to 10 once you're done with your coding
/************************************************************************/
var CONTAINERS = 3;
var SLOTS = 5;

var OPTIONS = ["carbon", "thamium9", "plutonium", "heridium", "platinum", "chrysonite", "iron", "zinc", "titanium", "nickel", "iridium", "copper", "gold", "emeril", "aluminium", "candensium", "fervidium", "mordite", "pugneum", "spadonium", "tropheum", "temerium", "coryzagen", "coprite", "rubeum", "viridium", "cymatygen", "omegon", "radnox", "murrine", "calium", "antrium", "rigogen", "bypass-chip", "albumen-pearl"];

var ALLITEMS = {
	"resources": ["carbon", "thamium9", "plutonium", "heridium", "platinum", "chrysonite", "iron", "zinc",
					"titanium", "nickel", "iridium", "copper", "gold", "emeril", "aluminium", "candensium",
					"fervidium", "mordite", "pugneum", "spadonium", "tropheum", "temerium", "coryzagen",
					"coprite", "rubeum", "viridium", "cymatygen", "omegon", "radnox", "murrine", "calium",
					"antrium", "rigogen"],
	"devices": ["atlas-pass-v1", "atlas-pass-v2", "atlas-pass-v3", "bypass-chip"],
	"components": ["carite-sheet", "night-crystals", "microdensity-fabric", "electron-vapor", "antimatter",
					"suspension-fluid", "dynamic-resonator", "voltaic-cell", "acid", "circuit-board",
					"copper-wire", "explosive", "insulating-gel", "glass", "lubricant", "non-ferrous-plate",
					"poli-fibre", "shielding-shard", "shielding-plate", "shielding-sheet"],
	"tradeables": ["albumen-pearl", "aquasphere", "vortex-cube", "gek-relic", "vykeen-efigy", "korwax-casing",
					"atlas-stone", "grahgrah", "fascination-bead", "gek-charm", "vykeen-dagger", "korvax-cube",
					"geknip", "gravitino-ball", "sac-venom", "neutrino-module"],
	"alloy": ["aronium", "herox", "lemmium", "crolium", "magmox", "grantine", "terumin"],
	"energy": ["unstable-plasma", "warp-cell", "power-gel", "power-canister", "power-reservoir"]
};

// I am using the name of each group as the same before each page. so, Carbon for example is under resources-carbon.html, and Atlas Pass V1 under devices-atlas-pass-v1.html if you plan to make the link to each page


// language.js
var ITEMSLANG = {
	"en": {
		"translation": {
			"language": "Language",
			"menu_item_1": "Menu Item 1",
			"menu_item_2": "Menu Item 2",
			"menu_item_3": "Menu Item 3",
			"menu_item_4": "Menu Item 4",
			"quantity": "Quantity",
			"carbon": "carbon",
			"thamium9": "thamium9",
			"plutonium": "plutonium",
			"heridium": "heridium",
			"platinum": "platinum",
			"chrysonite": "chrysonite",
			"iron": "iron",
			"zinc": "zinc",
			"titanium": "titanium",
			"nickel": "nickel",
			"iridium": "iridium",
			"copper": "copper",
			"gold": "gold",
			"emeril": "emeril",
			"aluminium": "aluminium",
			"candensium": "candensium",
			"fervidium": "fervidium",
			"mordite": "mordite",
			"pugneum": "pugneum",
			"spadonium": "spadonium",
			"tropheum": "tropheum",
			"temerium": "temerium",
			"coryzagen": "coryzagen",
			"coprite": "coprite",
			"rubeum": "rubeum",
			"viridium" :"viridium",
			"cymatygen": "cymatygen",
			"omegon": "omegon",
			"radnox": "radnox",
			"murrine": "murrine",
			"calium": "calium",
			"antrium": "antrium",
			"rigogen": "rigogen",
			"bypass-chip": "bypass-chip",
			"albumen-pearl": "albumen-pearl",

		}
	},
	"br": {
		"translation": {
			"language": "Idioma",
			"menu_item_1": "Menu Item 1",
			"menu_item_2": "Menu Item 2",
			"menu_item_3": "Menu Item 3",
			"menu_item_4": "Menu Item 4",
			"quantity": "Quantidade",
			"carbon": "carbono",
			"thamium9": "tâmio9",
			"plutonium": "plutônio",
			"heridium": "herídio",
			"platinum": "platina",
			"chrysonite": "crisonita",
			"iron": "ferro",
			"zinc": "zinco",
			"titanium": "titânio",
			"nickel": "níquel",
			"iridium": "irídio",
			"copper": "cobre",
			"gold": "ouro",
			"emeril": "emeril",
			"aluminium": "alumínio",
			"candensium": "candênsio",
			"fervidium": "fervídio",
			"mordite": "mordita",
			"pugneum": "púgneo",
			"spadonium": "espadônio",
			"tropheum": "trófeo",
			"temerium": "temério",
			"coryzagen": "corazigênio",
			"coprite": "coprita",
			"rubeum": "rúbeo",
			"viridium" :"virídio",
			"cymatygen": "cimatigênio",
			"omegon": "omegon",
			"radnox": "rádnox",
			"murrine": "murrine",
			"calium": "cálio",
			"antrium": "ântrio",
			"rigogen": "rigogênio",
			"bypass-chip": "bypass chip",
			"albumen-pearl": "pérola de albumina",
		}
	}
};