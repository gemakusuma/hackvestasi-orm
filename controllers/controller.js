const Helper = require('../helpers/helper')
const {Company, User, Transaction, BalanceHistory, CompanyDetail} = require('../models/index')
var session = require('express-session')
const { Op } = require("sequelize");
const { createTransport } = require('nodemailer');

const transactionBalanceDeposit = 1;
const transactionBalanceBuy = 2;


class Controller {

    static async listCompany(req, res) {
        try {
            let search = req.query.search
            if(!search) search = ""

            let companies = await Company.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            });

            res.render("listCompany", {companies});
        } catch (error) {
            res.send(error);
        }
    }


    static async detailCompany(req, res) {
        try {
            let errors = Helper.getErrors(req.query)
            let company = await Company.findOne({
                where: {
                    id: req.params.id
                }
            });

            res.render("detailCompany", {company, errors});
        } catch (error) {
            res.send(error);
        }
    }


    static async listTransaction(req, res) {
        try {
            let transactions = await Transaction.findAll({
                include: [
                    User,
                    Company,
                ],
                where: {
                    user_id: req.session.user_id
                }
            });

            res.render("listTransaction", {transactions});
        } catch (error) {
            res.send(error);
        }
    }


    static async listBalanceHistories(req, res) {
        try {
            let balanceHistories = await BalanceHistory.findAll({
                where: {
                    user_id: req.session.user_id
                }
            });

            let user = await User.findOne({
                where: {
                    id: req.session.user_id
                }
            });

            res.render("listBalanceHistory", {user, balanceHistories});
        } catch (error) {
            res.send(error);
        }
    }

    static async postCreateTransaction(req, res) {
        try {
            /*
                 1. validasi balancenya apakah cukup atau tidak
                 2. create transaction ke Table Transaction
                 3. kurangin balance di Table User
                 4.  create history balance di Table BalanceHistory
             */

            let user = await User.findOne({
                where: {
                    id: req.session.user_id
                }
            });

            let total = req.body.total;
            total = total.replace('Rp.', '');
            total = total.split('.');
            let newTotal = "";
            for (let i in total) {
                newTotal += total[i];
            }
            newTotal = Number(newTotal);

            // 1. validasi saldonya apakah cukup atau tidak
            if (newTotal > user.balance) {
                throw {name: "validation", errors: ["Saldo tidak mencukupi"]};
            } else if (newTotal === 0) {
                throw {name: "validation", errors: ["Nilai Investasi harus diisi"]};
            } else {
                let tempObj = {
                    total: newTotal,
                    user_id: req.session.user_id,
                    company_id: req.body.company_id,
                    date: new Date(),
                }

                // 2. create transaction ke Table Transaction
                await Transaction.create(tempObj);

                // 3. kurangin balance di Table User
                await User.increment({balance: -newTotal}, {where: {id: req.session.user_id}})

                tempObj = {
                    transaction_type: transactionBalanceBuy,
                    user_id: req.session.user_id,
                    total: newTotal,
                    date: new Date(),
                };

                // 4.  create history balance di Table BalanceHistory
                await BalanceHistory.create(tempObj);
                res.redirect('/transactions')
            }
        } catch (error) {
            Helper.setErrors(res, error, `/companies/${req.body.company_id}`)
        }
    }

    static async postTransactionDeposit(req, res) {
        try {
            let balance = req.body.balance;
            balance = balance.replace('Rp.', '');
            balance = balance.split('.');
            let newBalance = "";
            for (let i in balance) {
                newBalance += balance[i];
            }

            await BalanceHistory.create({
                transaction_type: transactionBalanceDeposit,
                user_id: req.session.user_id,
                total: newBalance,
                date: new Date(),
            });

            await User.increment({balance: newBalance}, {where: {id: req.session.user_id}})
            res.redirect('/balance-histories');
        } catch (error) {
            res.send(error);
        }
    }

    static async login(req, res) {
        try {
            let errors = Helper.getErrors(req.query)
            res.render("login", {errors});
        } catch (error) {
            res.send(error);
        }
    }

    static async postLogin(req, res) {
        try {
            let {email, password} = req.body;

            let user = await User.findOne({
                where: {
                    email: email
                }
            })


            if (!user) {
                res.redirect('/login?errors=Email or Password is wrong')
            } else {
                let validatePassword = Helper.validatePassword(password, user.password)

                if (validatePassword) {
                    req.session.user_id = user.id;
                    req.session.role = user.role;

                    if(user.role === 1){
                        res.redirect('/admin');
                    }else{
                        res.redirect('/companies');
                    }

                } else {
                    res.redirect('/login?errors=Email or Password is wrong');
                }
            }
        } catch (error) {
            console.log(error)
            Helper.setErrors(res, error, '/login')
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy(function (err) {
            })
            res.redirect('/transactions');
        } catch (error) {
            Helper.setErrors(res, error, '/login')
        }
    }


    static async register(req, res) {
        try {
            let errors = Helper.getErrors(req.query)

            res.render("register", {errors});
        } catch (error) {
            res.send(error);
        }
    }

    static async postRegister(req, res) {
        try {
            let {name, email, password} = req.body;
            await User.create({
                name, email, password
            });

            const transporter = createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                auth: {
                    user: "dityaksm21@gmail.com",
                    pass: "E87Mt6wq2hYLdHTK",
                },
            });

            await transporter.sendMail({
                from: 'dityaksm21@gmail.com',
                to: email,
                subject: `Welcome to Hackvestasi`,
                html : '<h1> Selamat Datang di Hackvestasi, disini kamu bisa berinvestasi dengan tenang. </h1>'
            })


            res.redirect('/login')
        } catch (error) {
            Helper.setErrors(res, error, '/register')
        }
    }


    static async adminListCompany(req, res) {
        try {
            let companies = await Company.findAll();

            res.render("adminListCompany", {companies});
        } catch (error) {
            res.send(error);
        }
    }

    static async adminCreateCompany(req, res) {
        try {
            let errors = Helper.getErrors(req.query)
            let companies = await Company.findAll();

            res.render("adminCreateCompany", {companies, errors});
        } catch (error) {
            res.send(error);
        }
    }

    static async adminPostCreateCompany(req, res) {
        try {
            let {name, description, image, risk_level, growth, obligasi_pemerintah, obligasi_korporasi, pasar_uang} = req.body

            let company = await Company.create({
                name, description, image, risk_level, growth
            });

            await CompanyDetail.create({
                obligasi_pemerintah, obligasi_korporasi, pasar_uang,
                company_id: company.id
            });

            res.redirect("/admin");
        } catch (error) {
            Helper.setErrors(res, error, `/admin/create`)
        }
    }

    static async adminUpdateCompany(req, res) {
        try {
            let {name, description, image, risk_level, growth, obligasi_pemerintah, obligasi_korporasi, pasar_uang} = req.body

            await Company.update({
                name, description, image, risk_level, growth
            }, {
                where: {
                    id: req.params.id
                }
            });


            await CompanyDetail.update({
                obligasi_pemerintah, obligasi_korporasi, pasar_uang
            }, {
                where: {
                    id: req.params.id
                }
            });

            res.redirect("/admin");
        } catch (error) {
            Helper.setErrors(res, error, `/admin/${req.params.id}/edit`)
        }
    }


    static async adminEditCompany(req, res) {
        try {
            let errors = Helper.getErrors(req.query)
            let company = await Company.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    CompanyDetail
                ],
            });

            res.render("adminEditCompany", {company, errors});
        } catch (error) {
            res.send(error);
        }
    }
    static async adminDeleteCompany(req, res) {
        try {
            await Company.destroy({
                where: {
                    id: req.params.id
                }
            });

            res.redirect('/admin')
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = Controller