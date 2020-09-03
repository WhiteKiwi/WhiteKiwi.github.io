module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true,
		},
		"ecmaVersion": 12,
		"sourceType": "module",
	},
	"plugins": [
		"react",
	],
	"globals": {
		"module": "writable",
	},
	"rules": {
		"quotes": [
			"error",
			"double",
		],
		"camelcase": [
			"error",
		],
		"prefer-arrow-callback": [
			"error",
		],
		"arrow-spacing": [
			"error",
		],
		"semi": [
			"error",
			"never",
		],
		"eol-last": [
			"error",
			"always",
		],
		"react/prop-types": [
			0,
		],
		"comma-dangle": [
			"error",
			"always-multiline",
		],
	},
}
