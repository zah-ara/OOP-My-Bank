import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// Customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
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
    customers = [];
    accounts = [];
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
// Customer creation
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    // Generate a random phone number
    let num = faker.phone.number();
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accNumber: cus.accNumber, balance: 1000 * i });
    // // Print out the generated account numbers
    // console.log(`Generated Account Number: ${cus.accNumber}`);
}
// for (let i: number = 1; i <= 3; i++) {
//     let fName = faker.person.firstName("male");
//     let lName = faker.person.lastName();
//     // Generate a random phone number
//     let num = faker.phone.number();
//     const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
//     myBank.addCustomer(cus);
//     myBank.addAccount({ accNumber: cus.accNumber, balance: 1000 * i });
// }
// Bank Functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select The Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        // View Balance
        if (service.select === "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let name = myBank.customers.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green(name?.firstName)} ${chalk.green(name?.lastName)} Your Account Balance Is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }
        // Cash Withdraw
        if (service.select === "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter Your Amount.",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Your Current Balance Is Insufficient"));
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
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.accounts.find((acc) => acc.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let ans = await inquirer.prompt({
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
}
async function mainLoop() {
    while (true) {
        await bankService(myBank);
    }
}
// async function mainLoop() {
//     while (true) {
//         try {
//             const chalk = await import("chalk");
//             await bankService(myBank);
//         } catch (error) {
//             console.error("Error loading chalk:", error);
//         }
//     }
// }
mainLoop();
