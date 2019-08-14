module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	testEnvironment: 'node',
	modulePathIgnorePatterns: ["<rootDir>/dist/"],
	coveragePathIgnorePatterns: [
		"node_modules",
		"<rootDir>/src/util/",
		"<rootDir>/src/config/",
		"<rootDir>/src/connect.ts",
	],
};
