module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"quotes": [
			"error",
			"double"
		],
		"camelcase": [
			"error"
		],
		"prefer-arrow-callback": [
			"error"
		],
		"arrow-spacing": [
			"error"
		],
		"semi": [
			"error",
			"never"
		],
		"eol-last": [
			"error",
			"always"
		]
	}
}
