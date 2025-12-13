// Jest setup: add Node polyfills used by react-dom/server in jsdom
const util = require('util')
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = util.TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = util.TextDecoder
}

// Optional: set NODE environment for next.js utilities
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
