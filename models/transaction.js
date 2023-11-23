'use strict';
const {
  Model
} = require('sequelize');
const Helper = require("../helpers/helper");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id"
      })
      Transaction.belongsTo(models.Company, {
        foreignKey: "company_id"
      })
    }


    get totalRupiahFormat() {
      return Helper.currencyFormat(this.total);
    }

    formatDate() {
      return Helper.formatDate(this.date)
    }


    get riskLevelWord() {
      let riskLevel = "Rendah"
      if (this.risk_level === riskLevelMedium) {
        riskLevel = "Sedang"
      } else if (this.risk_level === riskLevelHigh) {
        riskLevel = "Tinggi"
      }

      return riskLevel



    }


    flagData() {
      let flag = {
        styleGrowth: "green"
      }

      if (this.Company.growth < 0) {
        flag['styleGrowth'] = "red";
      }

      return flag;
    }


  }
  Transaction.init({
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your Total'
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your Date'
        }
      }
    },
    company_id: {
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};