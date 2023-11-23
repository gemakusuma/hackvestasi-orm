'use strict';
const {
    Model
} = require('sequelize');

const riskLevelLow = 1; // Konservatif (tipe investor dengan profil risiko paling rendah)
const riskLevelMedium = 2; // Moderat (tipe investor dengan profil risiko sedang)
const riskLevelHigh = 3; // Agresif (tipe investor dengan profil risiko yang tinggi)


module.exports = (sequelize, DataTypes) => {
    class Company extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Company.belongsToMany(models.User, {
            //     through: "Transactions",
            //     foreignKey: "company_id"
            // })
            Company.hasMany(models.Transaction, {
                foreignKey: "company_id"
            })


            Company.hasOne(models.CompanyDetail,{
                foreignKey: "company_id"
            })
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

        get growthFlag() {
            let flag = "green"
            if (this.growth < 0) {
                flag = "red"
            }

            return flag
        }

    }

    Company.init({
        name: {
            type: DataTypes.STRING,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Name'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Description'
                }
            }
        },
        image: {
            type: DataTypes.STRING,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Image'
                }
            }
        },
        risk_level: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Risk Level'
                }
            }
        },
        growth: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Growth'
                }
            }
        },
    }, {
        sequelize,
        modelName: 'Company',
    });
    return Company;
};

