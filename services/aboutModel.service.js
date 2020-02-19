"use strict";


const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");


// Create a Sequelize service for `post` entities
module.exports = {
    name: "aboutModel",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://postgres:1@localhost:5432/api_project"),
    model: {
        name: "about",
        define: {
            _id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            text_arm: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            text_rus: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            text_eng: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        },
        options: {
            // Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
            underscored: true,
            freezeTableName: true,
            timestamps: false
        }
    },
    settings: {
        // fields: ["_id", "text_arm"],
        // entityValidator: {
        //     status: "string"
        // }
    }
};
