'use strict';
const {
    Model
} = require('sequelize');

const transactionBalanceDeposit = 1;
const transactionBalanceBuy = 2;

const Helper = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
    class BalanceHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BalanceHistory.belongsToMany(models.User, {
                through: "Users",
                foreignKey: "user_id",
                as: "Tessss"
            })
        }


        get totalRupiahFormat() {
            return Helper.currencyFormat(this.total);
        }

        formatDate() {
            return Helper.formatDate(this.date)
        }


        get flagData(){
            return BalanceHistory.getFlagData(this.transaction_type)
        }

        static getFlagData(transaction_type) {
            let flag = {
                lineClass: "danger",
                symbol: "-",
                type: "Pembelian Reksadana"
            }

            if (transaction_type === transactionBalanceDeposit) {
                flag['lineClass'] = "success";
                flag['symbol'] = "+";
                flag['type'] = "Deposit Saldo";
            }

            return flag;
        }


    }

    BalanceHistory.init({
        transaction_type: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        date: DataTypes.DATE,
        user_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'BalanceHistory',
    });
    return BalanceHistory;
};