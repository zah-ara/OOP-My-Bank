"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
// Customer class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// Bank class
class Bank {
    constructor() {
        this.customers = [];
        this.accounts = [];
    }
    addCustomer(obj) {
        this.customers.push(obj);
    }
    addAccount(obj) {
        this.accounts.push(obj);
    }
    printCustomerDetails() {
        this.customers.forEach(customer => {
            const account = this.accounts.find(acc => acc.accNumber === customer.accNumber);
            if (account) {
                console.log(`Customer: ${customer.firstName} ${customer.lastName}, Age: ${customer.age}, Gender: ${customer.gender}, Mobile: ${customer.mobNumber}, Account Number: ${customer.accNumber}, Balance: ${account.balance}`);
            }
        });
    }
    transaction(accObj) {
        let newAccounts = this.accounts.filter(acc => acc.accNumber !== accObj.accNumber);
        this.accounts = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
// Customer creation
for (let i = 1; i <= 3; i++) {
    let fName = faker_1.faker.person.firstName("male");
    let lName = faker_1.faker.person.lastName();
    // Generate a random phone number
    let num = faker_1.faker.phone.number();
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accNumber: cus.accNumber, balance: 1000 * i });
}
// Bank Functionality
function bankService(bank) {
    return __awaiter(this, void 0, void 0, function* () {
        do {
            let service = yield inquirer_1.default.prompt({
                type: "list",
                name: "select",
                message: "Please Select The Service",
                choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
            });
            // View Balance
            if (service.select === "View Balance") {
                let res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please Enter Your Account Number:",
                });
                let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold("Invalid Account Number"));
                }
                else {
                    let name = myBank.customers.find((item) => item.accNumber == (account === null || account === void 0 ? void 0 : account.accNumber));
                    console.log(`Dear ${chalk_1.default.green(name === null || name === void 0 ? void 0 : name.firstName)} ${chalk_1.default.green(name === null || name === void 0 ? void 0 : name.lastName)} Your Account Balance Is ${chalk_1.default.bold.blueBright(`$${account.balance}`)}`);
                }
            }
            // Cash Withdraw
            if (service.select === "Cash Withdraw") {
                let res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please Enter Your Account Number:",
                });
                let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold("Invalid Account Number"));
                }
                else {
                    let ans = yield inquirer_1.default.prompt({
                        type: "number",
                        message: "Please Enter Your Amount.",
                        name: "rupee",
                    });
                    if (ans.rupee > account.balance) {
                        console.log(chalk_1.default.red.bold("Your Current Balance Is Insufficient"));
                    }
                    else {
                        let newBalance = account.balance - ans.rupee;
                        // transaction method call
                        bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                        console.log(`Your new balance is ${newBalance}`);
                    }
                }
            }
            // Cash Deposit
            if (service.select === "Cash Deposit") {
                let res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please Enter Your Account Number:",
                });
                let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold("Invalid Account Number"));
                }
                else {
                    let ans = yield inquirer_1.default.prompt({
                        type: "number",
                        message: "Please Enter Your Amount.",
                        name: "rupee",
                    });
                    let newBalance = account.balance + ans.rupee;
                    // transaction method call
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(`Your new balance is ${newBalance}`);
                }
            }
            if (service.select == "Exit") {
                return;
            }
        } while (true);
    });
}
function mainLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            yield bankService(myBank);
        }
    });
}
mainLoop();
