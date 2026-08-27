/* ==========================================
   KENYA SMART DIALER PRO
   LOAN CONTROLLER
========================================== */

"use strict";

const Loan =
    require("../models/Loan");

const Transaction =
    require("../models/Transaction");

const FinancialProfile =
    require("../models/FinancialProfile");

/* ==========================================
LOAN ELIGIBILITY ENGINE
========================================== */

exports.checkLoanEligibility = async (req, res) => {

    try {

        /* ==================================
           LOAD FINANCIAL PROFILE
        ================================== */

        const profile =
            await FinancialProfile.findOne({

                user:
                    req.user.userId

            });


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        /* ==================================
           LOAD TRANSACTIONS
        ================================== */

        const transactions =
            await Transaction.find({

                user:
                    req.user.userId,

                status:
                    "SUCCESS"

            }).sort({

                createdAt:
                    -1

            });


        /* ==================================
           FINANCIAL BALANCES
        ================================== */

        const kcbBalance =
            Number(
                profile.banks?.kcb?.balance || 0
            );

        const equityBalance =
            Number(
                profile.banks?.equity?.balance || 0
            );

        const coopBalance =
            Number(
                profile.banks?.coop?.balance || 0
            );

        const walletBalance =
            Number(
                profile.wallet?.balance || 0
            );


        const totalBalance =
            kcbBalance +
            equityBalance +
            coopBalance +
            walletBalance;


        /* ==================================
           EXISTING LOAN
        ================================== */

        const outstanding =
            Number(
                profile.loans?.outstanding || 0
            );


        /* ==================================
           TRANSACTION ANALYSIS
        ================================== */

        const transactionCount =
            transactions.length;


        const totalTransactionValue =
            transactions.reduce(

                (total, transaction) => {

                    return total +
                        Number(
                            transaction.amount || 0
                        );

                },

                0

            );


        /* ==================================
           LAST 30 DAYS ACTIVITY
        ================================== */

        const thirtyDaysAgo =
            new Date();

        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30
        );


        const recentTransactions =
            transactions.filter(

                transaction =>

                    new Date(
                        transaction.createdAt
                    ) >= thirtyDaysAgo

            );


        const recentTransactionCount =
            recentTransactions.length;


        /* ==================================
           AVERAGE TRANSACTION
        ================================== */

        const averageTransaction =

            transactionCount > 0

                ? totalTransactionValue /
                transactionCount

                : 0;


        /* ==================================
           ELIGIBILITY SCORE
        ================================== */

        let score = 0;


        /* Transaction history */

        if (transactionCount >= 10) {

            score += 20;

        }

        else if (transactionCount >= 5) {

            score += 15;

        }

        else if (transactionCount >= 3) {

            score += 10;

        }


        /* Recent activity */

        if (recentTransactionCount >= 10) {

            score += 20;

        }

        else if (recentTransactionCount >= 5) {

            score += 15;

        }

        else if (recentTransactionCount >= 2) {

            score += 10;

        }


        /* Current balance */

        if (totalBalance >= 100000) {

            score += 25;

        }

        else if (totalBalance >= 50000) {

            score += 20;

        }

        else if (totalBalance >= 20000) {

            score += 15;

        }

        else if (totalBalance >= 5000) {

            score += 10;

        }

        else if (totalBalance > 0) {

            score += 5;

        }


        /* Transaction value */

        if (totalTransactionValue >= 200000) {

            score += 20;

        }

        else if (totalTransactionValue >= 100000) {

            score += 15;

        }

        else if (totalTransactionValue >= 50000) {

            score += 10;

        }

        else if (totalTransactionValue >= 10000) {

            score += 5;

        }


        /* Average transaction */

        if (averageTransaction >= 20000) {

            score += 15;

        }

        else if (averageTransaction >= 10000) {

            score += 10;

        }

        else if (averageTransaction >= 5000) {

            score += 5;

        }


        /* ==================================
           EXISTING LOAN PENALTY
        ================================== */

        if (outstanding > 0) {

            score -= 30;

        }


        /* ==================================
           KEEP SCORE BETWEEN 0 AND 100
        ================================== */

        score =
            Math.max(
                0,
                Math.min(100, score)
            );


        /* ==================================
           APPROVAL DECISION
        ================================== */

        const approved =
            score >= 50 &&
            outstanding <= 0;


        /* ==================================
           CALCULATE INDIVIDUAL LIMIT
        ================================== */

        let loanLimit = 0;


        if (approved) {

            const balanceBasedLimit =
                totalBalance * 0.50;


            const activityBasedLimit =
                totalTransactionValue * 0.20;


            loanLimit =
                Math.min(

                    balanceBasedLimit +
                    activityBasedLimit,

                    100000

                );


            /* Round to nearest KSh 500 */

            loanLimit =
                Math.floor(
                    loanLimit / 500
                ) * 500;


            /* Minimum approved amount */

            if (loanLimit < 5000) {

                loanLimit = 5000;

            }

        }


        /* ==================================
           SAVE ELIGIBILITY RESULT
        ================================== */

        profile.loans.approved =
            approved;

        profile.loans.limit =
            loanLimit;


        await profile.save();


        /* ==================================
           RESPONSE
        ================================== */

        return res.status(200).json({

            success: true,

            eligibility: {

                approved,

                score,

                loanLimit,

                outstanding

            },

            analysis: {

                transactionCount,

                recentTransactionCount,

                totalTransactionValue,

                averageTransaction,

                totalBalance

            }

        });

    }

    catch (error) {

        console.error(
            "Loan Eligibility Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to calculate loan eligibility.",

            error:
                error.message

        });

    }

};

/* ==========================================
   APPLY LOAN
========================================== */

exports.applyLoan = async (req, res) => {

    try {

        const {
            loanType,
            amount,
            duration,
            purpose
        } = req.body;


        /* ==================================
           VALIDATE INPUT
        ================================== */

        const requestedAmount =
            Number(amount);

        const repaymentMonths =
            Number(duration);


        if (
            !Number.isFinite(requestedAmount) ||
            requestedAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid loan amount."

            });

        }


        if (
            !Number.isFinite(repaymentMonths) ||
            repaymentMonths <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a valid repayment duration."

            });

        }


        /* ==================================
           LOAD USER FINANCIAL PROFILE
        ================================== */

        const profile =
            await FinancialProfile.findOne({

                user:
                    req.user.userId

            });


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        /* ==================================
           CHECK LOAN APPROVAL
        ================================== */

        const approved =
            profile.loans?.approved === true;
        const loanLimit =
            Number(
                profile.loans?.limit || 0
            );


        const outstanding =
            Number(
                profile.loans?.outstanding || 0
            );


        if (!approved) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not currently approved for a loan."

            });

        }


        if (loanLimit <= 0) {

            return res.status(403).json({

                success: false,

                message:
                    "Your current approved loan limit is KSh 0."

            });

        }


        /* ==================================
           CHECK EXISTING LOAN
        ================================== */

        if (outstanding > 0) {

            return res.status(403).json({

                success: false,

                message:
                    "You have an outstanding loan. Please repay it before applying for another loan."

            });

        }


        /* ==================================
           CHECK LOAN LIMIT
        ================================== */

        if (requestedAmount > loanLimit) {

            return res.status(400).json({

                success: false,

                message:
                    `Requested amount exceeds your approved loan limit of KSh ${loanLimit.toLocaleString()}.`

            });

        }


        /* ==================================
           CALCULATE REPAYMENT
        ================================== */

        const interestRate = 12;


        const interest =
            requestedAmount *
            (interestRate / 100);


        const totalRepayment =
            requestedAmount +
            interest;


        const monthlyPayment =
            totalRepayment /
            repaymentMonths;


        const repaymentDate =
            new Date();


        repaymentDate.setMonth(

            repaymentDate.getMonth() +
            repaymentMonths

        );


        /* ==================================
           CREATE LOAN
        ================================== */

        const loan =
            await Loan.create({

                user:
                    req.user.userId,

                loanType,

                amount:
                    requestedAmount,

                duration:
                    repaymentMonths,

                purpose,

                interestRate,

                monthlyPayment,

                totalRepayment,

                balance:
                    totalRepayment,

                repaymentDate,

                status:
                    "ACTIVE"

            });


        /* ==================================
           UPDATE FINANCIAL PROFILE
        ================================== */

        profile.loans.outstanding =
            totalRepayment;


        await profile.save();


        /* ==================================
           CREATE TRANSACTION
        ================================== */

        await Transaction.create({

            user:
                req.user.userId,

            bank:
                "KCB",

            service:
                "LOAN",

            sender:
                "KCB",

            recipient:
                req.user.userId,

            amount:
                requestedAmount,

            fee:
                interest,

            total:
                totalRepayment,

            status:
                "SUCCESS"

        });


        /* ==================================
           RESPONSE
        ================================== */

        return res.status(201).json({

            success: true,

            message:
                "Loan Approved",

            loan,

            loanLimit,

            outstanding:
                totalRepayment

        });

    }

    catch (error) {

        console.error(
            "Apply Loan Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


/* ==========================================
   LOAN HISTORY
========================================== */

exports.getLoans = async (req, res) => {

    try {

        const loans =
            await Loan.find({

                user:
                    req.user.userId

            }).sort({

                createdAt:
                    -1

            });


        return res.json({

            success: true,

            loans

        });

    }

    catch (error) {

        console.error(
            "Get Loans Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


/* ==========================================
   REPAY LOAN
========================================== */

exports.repayLoan = async (req, res) => {

    try {

        /* ==================================
           FIND LOAN
        ================================== */

        const loan =
            await Loan.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.userId

            });


        if (!loan) {

            return res.status(404).json({

                success: false,

                message:
                    "Loan not found."

            });

        }


        /* ==================================
           VALIDATE PAYMENT
        ================================== */

        const payment =
            Number(
                req.body.amount
            );


        if (
            !Number.isFinite(payment) ||
            payment <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid repayment amount."

            });

        }


        if (payment > loan.balance) {

            return res.status(400).json({

                success: false,

                message:
                    "Repayment amount cannot exceed the outstanding loan balance."

            });

        }


        /* ==================================
           UPDATE LOAN BALANCE
        ================================== */

        loan.balance -=
            payment;


        if (loan.balance <= 0) {

            loan.balance = 0;

            loan.status =
                "COMPLETED";

        }


        await loan.save();


        /* ==================================
           UPDATE FINANCIAL PROFILE
        ================================== */

        const profile =
            await FinancialProfile.findOne({

                user:
                    req.user.userId

            });


        if (profile) {

            profile.loans.outstanding =
                loan.balance;


            await profile.save();

        }


        /* ==================================
           CREATE REPAYMENT TRANSACTION
        ================================== */

        await Transaction.create({

            user:
                req.user.userId,

            bank:
                "KCB",

            service:
                "LOAN REPAYMENT",

            sender:
                req.user.userId,

            recipient:
                "KCB",

            amount:
                payment,

            fee:
                0,

            total:
                payment,

            status:
                "SUCCESS"

        });


        /* ==================================
           RESPONSE
        ================================== */

        return res.json({

            success: true,

            message:
                "Loan Repayment Successful",

            loan

        });

    }

    catch (error) {

        console.error(
            "Repay Loan Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


/* ==========================================
   LOAN CALCULATOR
========================================== */

exports.calculateLoan = async (req, res) => {

    try {

        const {
            amount,
            duration
        } = req.body;


        const requestedAmount =
            Number(amount);


        const repaymentMonths =
            Number(duration);


        if (
            !Number.isFinite(requestedAmount) ||
            requestedAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid loan amount."

            });

        }


        if (
            !Number.isFinite(repaymentMonths) ||
            repaymentMonths <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a valid duration."

            });

        }


        const interestRate =
            12;


        const interest =
            requestedAmount *
            (interestRate / 100);


        const totalRepayment =
            requestedAmount +
            interest;


        const monthlyPayment =
            totalRepayment /
            repaymentMonths;


        return res.json({

            success: true,

            interestRate,

            interest,

            totalRepayment,

            monthlyPayment

        });

    }

    catch (error) {

        console.error(
            "Calculate Loan Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};

/* ==========================================
   LOAN ELIGIBILITY ENGINE
========================================== */

exports.getLoanEligibility = async (req, res) => {

    try {

        /* ==================================
           LOAD USER
        ================================== */

        const User =
            require("../models/User");

        const user =
            await User.findById(
                req.user.userId
            );

        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User account not found."

            });

        }


        /* ==================================
           LOAD FINANCIAL PROFILE
        ================================== */

        const profile =
            await FinancialProfile.findOne({

                user:
                    req.user.userId

            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        /* ==================================
           LOAD TRANSACTION HISTORY
        ================================== */

        const transactions =
            await Transaction.find({

                user:
                    req.user.userId

            }).sort({

                createdAt: -1

            }).limit(100);


        /* ==================================
           BASIC ACCOUNT FACTORS
        ================================== */

        let score = 300;

        const reasons = [];


        /* ==================================
           ACCOUNT AGE
        ================================== */

        const accountAgeDays =

            Math.max(

                0,

                Math.floor(

                    (
                        Date.now() -
                        new Date(user.createdAt).getTime()
                    ) /
                    (1000 * 60 * 60 * 24)

                )

            );


        if (accountAgeDays >= 180) {

            score += 100;

            reasons.push(
                "Account has more than 6 months of history."
            );

        }

        else if (accountAgeDays >= 90) {

            score += 70;

            reasons.push(
                "Account has more than 3 months of history."
            );

        }

        else if (accountAgeDays >= 30) {

            score += 40;

            reasons.push(
                "Account has more than 1 month of history."
            );

        }

        else {

            reasons.push(
                "Account history is still limited."
            );

        }


        /* ==================================
           TRANSACTION ACTIVITY
        ================================== */

        const transactionCount =
            transactions.length;


        if (transactionCount >= 50) {

            score += 120;

            reasons.push(
                "Strong transaction activity."
            );

        }

        else if (transactionCount >= 20) {

            score += 80;

            reasons.push(
                "Good transaction activity."
            );

        }

        else if (transactionCount >= 5) {

            score += 40;

            reasons.push(
                "Some transaction activity detected."
            );

        }

        else {

            reasons.push(
                "Limited transaction activity."
            );

        }


        /* ==================================
           BANK BALANCES
        ================================== */

        const kcbBalance =
            Number(
                profile.banks?.kcb?.balance || 0
            );

        const equityBalance =
            Number(
                profile.banks?.equity?.balance || 0
            );

        const coopBalance =
            Number(
                profile.banks?.coop?.balance || 0
            );

        const savings =
            Number(
                profile.savings?.balance || 0
            );

        const wallet =
            Number(
                profile.wallet?.balance || 0
            );


        const totalAssets =

            kcbBalance +
            equityBalance +
            coopBalance +
            savings +
            wallet;


        /* ==================================
           ASSET SCORE
        ================================== */

        if (totalAssets >= 100000) {

            score += 120;

            reasons.push(
                "Strong financial balances."
            );

        }

        else if (totalAssets >= 50000) {

            score += 90;

            reasons.push(
                "Good financial balances."
            );

        }

        else if (totalAssets >= 20000) {

            score += 60;

            reasons.push(
                "Moderate financial balances."
            );

        }

        else if (totalAssets >= 5000) {

            score += 30;

            reasons.push(
                "Some financial balance activity."
            );

        }

        else {

            reasons.push(
                "Low current financial balances."
            );

        }


        /* ==================================
           SAVINGS BEHAVIOUR
        ================================== */

        if (savings >= 50000) {

            score += 80;

        }

        else if (savings >= 20000) {

            score += 60;

        }

        else if (savings >= 5000) {

            score += 30;

        }


        /* ==================================
           EXISTING LOAN
        ================================== */

        const outstanding =

            Number(
                profile.loans?.outstanding || 0
            );


        if (outstanding > 0) {

            score -= 150;

            reasons.push(
                "Customer currently has an outstanding loan."
            );

        }


        /* ==================================
           PREVIOUS LOAN HISTORY
        ================================== */

        const previousLoans =
            await Loan.find({

                user:
                    req.user.userId

            });


        const completedLoans =
            previousLoans.filter(

                loan =>
                    loan.status ===
                    "COMPLETED"

            );


        if (completedLoans.length >= 3) {

            score += 120;

            reasons.push(
                "Strong previous loan repayment history."
            );

        }

        else if (completedLoans.length >= 1) {

            score += 70;

            reasons.push(
                "Previous loan successfully completed."
            );

        }


        /* ==================================
           FAILED / REJECTED LOANS
        ================================== */

        const rejectedLoans =
            previousLoans.filter(

                loan =>
                    loan.status ===
                    "REJECTED"

            );


        if (rejectedLoans.length >= 3) {

            score -= 60;

            reasons.push(
                "Several previous loan applications were rejected."
            );

        }


        /* ==================================
           LIMIT SCORE
        ================================== */

        score =
            Math.max(
                0,
                Math.min(
                    850,
                    Math.round(score)
                )
            );


        /* ==================================
           DETERMINE ELIGIBILITY
        ================================== */

        let eligible = false;

        let loanLimit = 0;


        if (
            score >= 700 &&
            outstanding === 0
        ) {

            eligible = true;

            loanLimit =
                Math.min(
                    100000,
                    Math.round(
                        totalAssets *
                        0.50
                    )
                );

        }

        else if (
            score >= 600 &&
            outstanding === 0
        ) {

            eligible = true;

            loanLimit =
                Math.min(
                    50000,
                    Math.round(
                        totalAssets *
                        0.35
                    )
                );

        }

        else if (
            score >= 500 &&
            outstanding === 0
        ) {

            eligible = true;

            loanLimit =
                Math.min(
                    20000,
                    Math.round(
                        totalAssets *
                        0.25
                    )
                );

        }


        /* ==================================
           MINIMUM LOAN LIMIT
        ================================== */

        if (loanLimit < 1000) {

            loanLimit = 0;

            eligible = false;

        }


        /* ==================================
           UPDATE FINANCIAL PROFILE
        ================================== */

        profile.loans.limit =
            loanLimit;

        profile.loans.approved =
            eligible;

        await profile.save();


        /* ==================================
           RECOMMENDED AMOUNT
        ================================== */

        const recommendedAmount =
            eligible
                ? Math.round(
                    loanLimit * 0.70
                )
                : 0;


        /* ==================================
           RESPONSE
        ================================== */

        return res.status(200).json({

            success: true,

            eligibility: {

                eligible,

                score,

                loanLimit,

                recommendedAmount,

                accountAgeDays,

                transactionCount,

                totalAssets,

                outstanding,

                reasons

            }

        });

    }

    catch (error) {

        console.error(
            "Loan Eligibility Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to calculate loan eligibility.",

            error:
                error.message

        });

    }

};


/* ==========================================
   EXPORT STATUS
========================================== */

console.log(
    "✅ Loan Controller Loaded"
);