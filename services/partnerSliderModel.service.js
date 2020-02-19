"use strict";


const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");


// Create a Sequelize service for `post` entities
module.exports = {
    name: "partnerSliderModel",
    mixins: [DbService],
    adapter: new SqlAdapter("postgres://postgres:1@localhost:5432/api_project"),
    model: {
        name: "partner_slider",
        define: {
            _id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            filepath: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            url: {
                type: Sequelize.TEXT
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
        // fields: ["_id", "filepath"],
        // entityValidator: {
        //     url: "string"
        // }
    }
};
