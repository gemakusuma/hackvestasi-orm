'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CompanyDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CompanyDetail.belongsTo(models.Company, {
                foreignKey: "company_id"
            })
        }
    }

    CompanyDetail.init({
        obligasi_pemerintah: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Obligasi Pemerintah'
                }
            }
        },
        obligasi_korporasi: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Obligasi Korporasi'
                }
            }
        },
        pasar_uang: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your Pasar Uang'
                }
            }
        },
    }, {
        sequelize,
        modelName: 'CompanyDetail',
    });
    return CompanyDetail;
};