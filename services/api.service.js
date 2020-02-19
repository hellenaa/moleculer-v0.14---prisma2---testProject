"use strict";

const ApiGateway = require("moleculer-web");
const multer = require("multer");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	}
});
const upload = multer({ storage: storage });

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,
		path: "/api",

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/uploads",
				// whitelist: [
				// 	// Access to any actions in all services under "/api" URL
				// 	"**"
				// ]
				bodyParsers: {
					json: false,
					urlencoded: false
				},
				aliases: {
					// File upload from HTML multipart form
					"POST /": "multipart:greeter.partnerSlidersImages",
					"POST /multi": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: {
								files: 5
							}
						},
						action: "greeter.partnerSlidersImages"
					}
					// File upload from AJAX or cURL
					// "PUT /": "stream:greeter.partnerSlidersPost"
				},

				busboyConfig: {
					limits: {
						files: 1
					}
				},

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {
					meta: {
						a: 5
					}
				},

				mappingPolicy: "restrict",
				// Enable/disable logging
				logging: true,
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false
			},
			{
				path: "/partners",
				use: [
					upload.single("image")
					// upload.array('image', 2)
				],
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: true
					}
				},
				aliases: {
					"POST /": "greeter.partnerSlidersPost"
				},

				onBeforeCall(ctx, route, req, res) {
					if (req.file) {
						ctx.meta.file = req.file;
						// console.log(req.files[0]);
						// ctx.meta.files = req.files;
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "restrict", // Available values: "all", "restrict"
				logging: true,
				mergeParams: true,
				authentication: false,
				authorization: false
			},
			{
				path: "/",

				// whitelist: [
				// 	"**"
				// ],

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.

				// autoAliases: true,

				aliases: {
					"GET abouts/:id": "greeter.aboutById",
					"PUT abouts/:id": "greeter.aboutEditById",
					"GET about": "greeter.aboutByStatus",
					"POST abouts": "greeter.abouts",
					"GET show2": "show2.bad",
					"GET /": "greeter.partnerSliders",
					"POST /blog":"greeter.postBlog",
					"POST blog/:id/comment":"greeter.postComment",
					"GET /blogs":"greeter.getBlogs",
					"GET /blogs/:id":"greeter.getBlogById"
					// "POST /partners": "greeter.partnerSlidersPost"
				},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 *
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. More info:
				// https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "restrict", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,

				// Route-level Express middlewares. More info:
				// https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info:
				// https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method.
				// More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method.
				// More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false
			}

		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null


		// Serve assets from "public" folder. More info:
		// https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		// assets: {
		// 	folder: "public",
		//
		// 	// Options to `server-static` module
		// 	options: {}
		// }
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token === "123456") {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: "John Doe" };
				}
				// Invalid token
				throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);

			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Get the authenticated user.
			const { user } = ctx.meta;

			// It check the `auth` property in action schema.
			if (req.$action.auth === "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			}
		}

	}
};
