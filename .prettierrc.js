/**
 * This file is generated by coconfig. Do not edit it directly.
 * Instead, edit the coconfig.js or coconfig.ts file in your project root.
 *
 * See https://github.com/gas-buddy/coconfig for more information.
 * @version coconfig@0.9.1
 */
const configModule = require('@gasbuddy/coconfig');

const { configuration } = configModule['.prettierrc.js'] || (configModule.default && configModule.default['.prettierrc.js']);
const resolved = typeof configuration === 'function' ? configuration() : configuration;

module.exports = resolved;
