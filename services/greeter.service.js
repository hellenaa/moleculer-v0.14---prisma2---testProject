"use strict";

const { PrismaClient } = require("@prisma/client");
const { MoleculerError } = require("moleculer").Errors;
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient({ debug: true });
const uploadDir = path.join(__dirname, "uploads");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "greeter",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello(ctx) {
			const payload = "Hello event called";
			ctx.emit("hello.called", payload);
			return "Hello Moleculer";
		},
		bye(ctx) {
			console.log("bye");
			return ctx.call("greeter2.hello2");
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			params: {
				name: "string"
			},
			handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		},
		abouts: {
			params: {
				text_arm: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				text_rus: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				text_eng: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				status: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } }
			},
			async handler(ctx) {
				try {
					const about = await ctx.call("aboutModel.create", {
						text_arm: ctx.params.text_arm,
						text_rus: ctx.params.text_rus,
						text_eng: ctx.params.text_eng,
						status: ctx.params.status
					});
					if (about) {
						return await ctx.call("aboutModel.find", { query: { _id: about._id } });
					}
					return new MoleculerError();
				} catch (err) {
					return err.message;
				}
			}
		},
		aboutById: {
			params: {
			},
			async handler(ctx) {
				try {
					return await ctx.call("aboutModel.find", { query: { _id: ctx.params.id } /*search: "tu", searchFields: ["text_eng", "text_arm"], sort: "text_arm", limit: 5, offset: 2*/ });
				} catch (err) {
					return err.message;
				}
			}
		},
		aboutEditById: {
			params: {
				text_arm: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				text_rus: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				text_eng: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } },
				status: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } }
			},
			async handler(ctx) {
				try {
					return await ctx.call("aboutModel.update", {
						_id: ctx.params.id,
						text_arm: ctx.params.text_arm,
						text_rus: ctx.params.text_rus,
						text_eng: ctx.params.text_eng,
						status: ctx.params.status
					});
				} catch (err) {
					return err.message;
				}
			}
		},
		aboutByStatus: {
			params: {
			},
			async handler() {
				try {
					const about = await prisma.about.create({
						data: {
							text_arm: "lena",
							text_eng: "jdjd",
							text_rus: "jsjs",
							status: "show"
						}
					});
					return about;
					// return await ctx.call("aboutModel.find", { query: { status: "show"}});
				} catch (err) {
					return err.message;
				}
			}
		},
		partnerSliders: {
			// params: {
			// 	filepath: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } }
			// },
			async handler(ctx) {
				console.log(ctx.params);
				// console.log(ctx.meta);
				return new this.Promise(async (resolve, reject) => {
					try {
						const partnerSliders = await ctx.call("partnerSliderModel.find");
						resolve(partnerSliders);
					} catch (err) {
						reject(err.message);
					}
				});
			}
		},
		partnerSlidersImages: {

			async handler(ctx) {
				// console.log(ctx.params);
				// console.log(ctx.meta);
				return new this.Promise((resolve, reject) => {
					// //reject(new Error("Disk out of space"));

					const filename = this.randomName() + ctx.meta.filename;
					const filePath = path.join(uploadDir, filename);

					const f = fs.createWriteStream(filePath);
					f.on("close", () => {
						// File written successfully
						this.logger.info(`Uploaded file stored in '${filePath}'`);

						console.log(ctx.meta);
						console.log(ctx.meta.$multipart);
						// console.log(filepath);

						resolve({ filePath, meta: ctx.meta });
					});

					ctx.params.on("error", (err) => {
						this.logger.info("File error received", err.message);
						reject(err);
						// Destroy the local file
						f.destroy(err);
					});

					f.on("error", () => {
						// Remove the errored file.
						fs.unlinkSync(filePath);
					});

					ctx.params.pipe(f);
				});
			}
		},
		partnerSlidersPost: {
			params: {
				// url: { type: "string", min: 2, messages: { string: "The '{field}' field must be a string." } }
			},
			async handler(ctx) {
				const partners = await ctx.call("partnerSliderModel.create", {
					filepath: ctx.meta.file.path,
					url: ctx.params.url
				});
				return partners;
			}
		},
		postBlog: {
			params: {
				title: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } },
				content: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } },
				slug: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } }
			},
			async handler(ctx) {
				try {
					const blog = await prisma.blog_post.create({
						data: {
							title: ctx.params.title,
							content: ctx.params.content,
							slug: ctx.params.slug
							// comments: {
							// 	create: { content: "aaaa" }
							// }
						}
						// select: {
						// 	title: true
						// }
					});
					return blog;
				} catch (err) {
					return err;
				}
			}
		},
		postComment: {
			params: {
				id: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } },
				content: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } }
			},
			async handler(ctx) {
				try {
					const comment = await prisma.comment.create({
						data: {
							content: ctx.params.content,
							blog_post_id: {
								connect: { id: ctx.params.id }
							}
						}
					});
					return comment;
				} catch (err) {
					return err;
				}
			}
		},
		getBlogs: {
			async handler() {
				try {
					const blog_posts = await prisma.blog_post.findMany({
						include: {
							comments: true
						}
					});
					if (blog_posts) {
						return blog_posts;
					}
					return "No blog post found";
				} catch (err) {
					return err;
				}
			}
		},
		getBlogById: {
			params: {
				id: { type: "string", min: 2, messages: { min: "The '{field}' field must be at least 2 character." } }
			},
			async handler(ctx) {
				try {
					//blog_post with its comments
					const blog_post = prisma.blog_post.findOne({
						where: { id: ctx.params.id },
						include: {
							comments: true
						}
					});
					return blog_post;

					// //only comments
					// const blog_post = prisma.blog_post.findOne({
					// 	where: { id: ctx.params.id }
					// });
					// const comments = await blog_post.comments();
					// return comments;

				} catch (err) {
					return err;
				}
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		randomName() {
			return `unnamed_, ${Date.now()}`;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		console.log("created");
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		console.log("started");
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {
		console.log("stopped");
	}
};
