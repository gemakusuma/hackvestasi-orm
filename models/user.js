'use strict';
const {
    Model
} = require('sequelize');
const Helper = require('../helpers/helper')


module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // User.belongsToMany(models.Company, {
            //     through: "Transactions",
            //     foreignKey: "user_id"
            // })
            User.hasMany(models.Transaction, {
                foreignKey: "user_id"
            })


            // User.hasMany(models.BalanceHistory)

            // User.hasMany(models.BalanceHistory, {
            //     through: "BalanceHistories",
            //     foreignKey: "id"
            // })
        }


        get balanceRupiahFormat() {
            return Helper.currencyFormat(this.balance);
        }

    }

    User.init({
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Email'
                },
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Password'
                },
                validatePasswordMin(value) {
                    if (value.length < 8) {
                        throw "Minimum Length Password is 8";
                    }
                }
            }
        },
        role: {
            type: DataTypes.INTEGER
        },
        balance: {
            type: DataTypes.INTEGER
        },
    }, {
        sequelize,
        modelName: 'User',
    });

    User.beforeCreate(async (user, options) => {
        user.password = Helper.generatePassword(user.password);
        user.role = 2;
        user.balance = 0;
    });

    return User;
};

