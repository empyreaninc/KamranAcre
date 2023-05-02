const fs = require('fs/promises');
const fs2 = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const config = require('./settings.json');
const headlessSetting = config.Headless
const actionDelay = config.ActionDelay
const delayBeforeClosingInSeconds = config.DelayBeforeClosingInSeconds

const csvPath = './testinputs.csv';
//Wait func to slow down execution of script
function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
//clickElem makes code more readable & streamlined to write by taking the selector and page as inputs,
//clicks given selector on given page
async function clickElem(selector, clickPage) {
    let button = await clickPage.$(selector);
    await button.click();

}

//updateCsvColumn updates the cell corresponding to given line and  column number using given string inside csv file
async function updateCsvColumn(filePath, lineNumber, columnNumber, newString) {


    const csvData = fs2.readFileSync(filePath, 'utf8');
    const rows = csvData.split('\n');
    const targetRow = rows[lineNumber];
    const cells = targetRow.split(',');
    cells[columnNumber - 1] = newString.replace(/,/g, '');
    const updatedRow = cells.join(',');

    rows[lineNumber] = updatedRow;
    const updatedCSV = rows.join('\n');

    fs2.writeFileSync(filePath, updatedCSV);
}
//clickAndFill reduces clicking an element and filling text from 2 functions down to 1
async function clickAndFill(selector, text, clickPage) {
    await clickElem(selector, clickPage); await asyncWait(1);
    //Input postcode
    await clickPage.keyboard.insertText(text); await asyncWait(1);
}
//Converting wait function to async to allow it to be used with playwright async functions
async function asyncWait(seconds) {

    await wait(seconds);

}
//Main Playwright script that converts each line of csv into variables for use as inputs
async function run() {
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    const csvLines = csvContent.trim().split('\n');
    const promises = [];
    //looping asynchronously to run all instances of test at once with promise.all()
    for (let i = 1; i < csvLines.length; i++) {
        //splitting current csv line on comma to assign each cell's value to a variable for use in script
        const line = csvLines[i].split(',');
        let [purchaserType, jointMortgage, maximumLTV, applicant1Age, employmentStatus1, applicant2Age, employmentStatus2, maritalStatus, noDependantChildren, noDependantAdults, depositAmount, loanAmount, propertyValue, mortgageTermYears, assessOnInterestOnly, propertyPostcode, grossIncome, additionalIncome, otherNonTaxableIncome, limitedCompanyNetProfits, existingBTLRentalIncome, grossIncome2, additionalIncome2, limitedCompanyNetProfits2, otherNonTaxableIncome2, existingBTLRentalIncome2, existingMonthlyBTLOutgoings, totalMonthlyLoanPayments, creditCards, groundRentOrServiceCharge, travel, childCareCosts, otherExpenditure, existingMonthlyBTLOutgoings2, totalMonthlyLoanPayments2, creditCards2, groundRentOrServiceCharge2, travel2, childCareCosts2, otherExpenditure2, link, ExpectedTLA, ExpectedLTV, ExpectedTLAA, csvTLA, csvLTV, csvTLAA, csvErrorText, csvTestStatus] = line;



        const promise = (async () => {
            //launch playwright instance
            const browser = await chromium.launch({ headless: headlessSetting });
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(link);
            //selecting mortgage type
            await clickElem('#editMortgage', page);
            await asyncWait(actionDelay);
            await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(1) > div > div > div > button", page);
            await asyncWait(actionDelay);
            if (purchaserType == "Buying first house") {
                await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(1) > div > div > div > div > ul > li.selected > a", page);
                await asyncWait(actionDelay);
            } else if (purchaserType == "Buying a house - moving") {
                await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (purchaserType == "Moving to HSBC") {
                await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
            };
            //select joint or sole mortgage
            await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(2) > div > div > div > button", page);
            await asyncWait(actionDelay);
            if (jointMortgage == "Joint") {
                await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(2) > a", page);
                await asyncWait(actionDelay);
            } else if (jointMortgage == "Sole") {
                await clickElem("#mortgageTabPanel > div:nth-child(3) > div:nth-child(2) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            };
            //select LTV range
            await clickElem("#mortgageTabPanel > div:nth-child(4) > div > div > div > div > button", page); await asyncWait(actionDelay);
            if (maximumLTV == "<=85") {
                await clickElem("#mortgageTabPanel > div:nth-child(4) > div > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            } else if (maximumLTV == ">85") {
                await clickElem("#mortgageTabPanel > div:nth-child(4) > div > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            };
            //Selecting applicant age
            await clickElem("#mortgageTabPanel > div:nth-child(5) > div:nth-child(1) > div > div > div > button", page); await asyncWait(actionDelay);
            //age minus 17 as index is age 18 at 1 on drop down.
            if (applicant1Age < 19) { await clickElem("#mortgageTabPanel > div:nth-child(5) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(1) > a", page); await asyncWait(actionDelay); } else {
                await clickElem(`#mortgageTabPanel > div:nth-child(5) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(${applicant1Age - 17}) > a`, page); await asyncWait(actionDelay);
            }
            //Selecting applicant employment status
            await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > button", page); await asyncWait(actionDelay);
            if (employmentStatus1 == "Unknown" || employmentStatus1 === "") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Employed") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Self-employed") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Homemaker") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(4) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Receiving Pension / Disability Benifit") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(5) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Student") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(6) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Key/Part Time") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(7) > a", page); await asyncWait(actionDelay);
            } else if (employmentStatus1 == "Unemployed") {
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(8) > a", page); await asyncWait(actionDelay);
            };
            //if joint, selecitng age and employment status of second applicant
            if (jointMortgage == "Joint") {
                await clickElem("#mortgageTabPanel > div:nth-child(5) > div:nth-child(2) > div > div > div > button", page); await asyncWait(actionDelay);
                if (applicant2Age < 19) { await clickElem("#mortgageTabPanel > div:nth-child(5) > div:nth-child(2) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay); } else {
                    await clickElem(`#mortgageTabPanel > div:nth-child(5) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(${applicant2Age - 17}) > a`, page); await asyncWait(actionDelay);
                };
                await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > button", page); await asyncWait(actionDelay);
                if (employmentStatus2 == "Unknown" || employmentStatus2 === "") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Employed") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Self-employed") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Homemaker") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(4) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Receiving Pension / Disability Benifit") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(5) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Student") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(6) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Key/Part Time") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(7) > a", page); await asyncWait(actionDelay);
                } else if (employmentStatus2 == "Unemployed") {
                    await clickElem("#mortgageTabPanel > div:nth-child(6) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(8) > a", page); await asyncWait(actionDelay);
                };
            }
            //selecting relationship status
            await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > button", page); await asyncWait(actionDelay);
            if (maritalStatus == "Unknown") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Single") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Living Together") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Married/Civil Partnership") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(4) > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Divorced") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(5) > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Widowed") {
                await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(6) > a", page); await asyncWait(actionDelay);
            } else if (maritalStatus == "Separated") { await clickElem("#mortgageTabPanel > div:nth-child(7) > div > div > div > div > div > ul > li:nth-child(7) > a", page); await asyncWait(actionDelay); }
            await page.mouse.wheel(0, 200); await asyncWait(actionDelay);
            //Click dropdown for no. dependent children
            await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > button", page); await asyncWait(actionDelay);
            //Click option corresponding to input
            if (noDependantChildren == 0 || noDependantChildren == "" || noDependantChildren == undefined) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            } else if (noDependantChildren == 1) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (noDependantChildren == 2) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
            } else if (noDependantChildren == 3) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(4) > a", page); await asyncWait(actionDelay);
            } else if (noDependantChildren == 4) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(5) > a", page); await asyncWait(actionDelay);
            } else if (noDependantChildren >= 5) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(6) > a", page); await asyncWait(actionDelay);
            };
            //Click dropdown for no. dependent adults
            await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > button", page); await asyncWait(actionDelay);
            //Click option corresponding to input
            if (noDependantAdults == 0 || noDependantAdults == "" || noDependantAdults == undefined) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            } else if (noDependantAdults == 1) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (noDependantAdults == 2) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(3) > a", page); await asyncWait(actionDelay);
            } else if (noDependantAdults == 3) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(4) > a", page); await asyncWait(actionDelay);
            } else if (noDependantAdults == 4) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(5) > a", page); await asyncWait(actionDelay);
            } else if (noDependantAdults >= 5) {
                await clickElem("#mortgageTabPanel > div:nth-child(8) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(6) > a", page); await asyncWait(actionDelay);
            };

            //Type deposit amount into textbox if present 
            if (depositAmount === undefined || depositAmount === '') {
                console.log("No input for depositAmount")
            } else {
                await clickAndFill("#depositAmount", depositAmount, page); await asyncWait(actionDelay);

            };

            //Type loan amount into text field if present 
            if (loanAmount === undefined || loanAmount === '') {
                console.log("No input for loanAmount")
            } else {
                await clickAndFill("#loanAmount", loanAmount, page); await asyncWait(actionDelay);

            };
            //scrolling elements into view
            await page.mouse.wheel(0, 400); await asyncWait(actionDelay);

            //Type property value into textbox if present - "e" is usable for exponential symbol i.e 2e5 = 200000
            if (propertyValue === undefined || propertyValue === '') {
                console.log("No input for propertyValue")
            } else {
                await clickAndFill("#estimatedPropertyValue", propertyValue, page); await asyncWait(actionDelay);
            };
            //Click Required mortgage term(s) (in years) dropdown 
            await clickElem("#mortgageTabPanel > div:nth-child(11) > div:nth-child(1) > div > div > div > button", page); await asyncWait(actionDelay);
            //Click number of years required 5-35. Index 1 at 5 years, hence value is years-4. Will default to 5 year term if empty.
            //Corrects mortgage term to 25 if assessing on interest basis only & mortgage input is over 25 years
            if (mortgageTermYears == 5 || mortgageTermYears === "") {
                await clickElem("#mortgageTabPanel > div:nth-child(11) > div:nth-child(1) > div > div > div > div > ul > li.selected > a", page)
            } else if (assessOnInterestOnly.toLocaleLowerCase() == "yes" && mortgageTermYears > 25) {
                console.log("Mortgage term for assess on interest basis only applications cannot be above 25 years, defaulting to 25 ");
                mortgageTermYears = 25;
                await clickElem(`#mortgageTabPanel > div:nth-child(11) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(${mortgageTermYears - 4}) > a`, page)
            } else {
                await clickElem(`#mortgageTabPanel > div:nth-child(11) > div:nth-child(1) > div > div > div > div > ul > li:nth-child(${mortgageTermYears - 4}) > a`, page)
            };
            //Click dropdown for Assess On Interest Only Basis
            await clickElem("#mortgageTabPanel > div:nth-child(11) > div:nth-child(2) > div > div > div > button", page); await asyncWait(actionDelay);
            //Click "Yes" or "No" corresponding to CSV input
            if (assessOnInterestOnly.toLowerCase() == "yes") {
                await clickElem("#mortgageTabPanel > div:nth-child(11) > div:nth-child(2) > div > div > div > div > ul > li:nth-child(2) > a", page); await asyncWait(actionDelay);
            } else if (assessOnInterestOnly.toLowerCase() == "no") {
                await clickElem("#mortgageTabPanel > div:nth-child(11) > div:nth-child(2) > div > div > div > div > ul > li.selected > a", page); await asyncWait(actionDelay);
            };

            //Input postcode
            await clickAndFill("#postcode", propertyPostcode, page); await asyncWait(actionDelay);
            //Click "Next"
            await clickElem("#mortgageNextBtn", page); await asyncWait(2);
            await page.mouse.wheel(0, 150); await asyncWait(actionDelay);
            //Next 5 actions fill out Income section for person 1 
            await clickAndFill("#a1grossIncome", grossIncome, page); await asyncWait(0.5);
            await clickAndFill("#a1additionalIncome", additionalIncome, page); await asyncWait(0.5);
            await clickAndFill("#a1dividendIncome", limitedCompanyNetProfits, page); await asyncWait(0.5);
            await clickAndFill("#a1otherNonTaxableIncome", otherNonTaxableIncome, page); await asyncWait(0.5);
            await clickAndFill("#a1existingBTLRentalIncome", existingBTLRentalIncome, page); await asyncWait(0.5);
            //Next 5 actions fill out Income section for person 2 if Joint
            if (jointMortgage == "Joint") {
                await clickAndFill("#a2grossIncome", grossIncome2, page); await asyncWait(0.5);
                await clickAndFill("#a2additionalIncome", additionalIncome2, page); await asyncWait(0.5);
                await clickAndFill("#a2dividendIncome", limitedCompanyNetProfits2, page); await asyncWait(0.5);
                await clickAndFill("#a2otherNonTaxableIncome", otherNonTaxableIncome2, page); await asyncWait(0.5);
                await clickAndFill("#a2existingBTLRentalIncome", existingBTLRentalIncome2, page); await asyncWait(0.5);
            };
            //Click "Next"
            await clickElem("#incomeNextBtn", page); await asyncWait(2);
            //Fill out expenditure form for person 1 
            await clickAndFill("#a1existingBTLOutgoings", existingMonthlyBTLOutgoings, page); await asyncWait(0.5);
            await clickAndFill("#a1totalMonthlyLoanPayments", totalMonthlyLoanPayments, page); await asyncWait(0.5);
            await clickAndFill("#a1outstandingCreditCardBalances", creditCards, page); await asyncWait(0.5);
            await clickAndFill("#a1rentAndServiceCharge", groundRentOrServiceCharge, page); await asyncWait(0.5);
            await clickAndFill("#a1travel", travel, page); await asyncWait(0.5);
            //Fill out expenditure form for person 2 if Joint
            if (jointMortgage == "Joint") {
                await clickAndFill("#a2existingBTLOutgoings", existingMonthlyBTLOutgoings2, page); await asyncWait(0.5);
                await clickAndFill("#a2totalMonthlyLoanPayments", totalMonthlyLoanPayments2, page); await asyncWait(0.5);
                await clickAndFill("#a2outstandingCreditCardBalances", creditCards2, page); await asyncWait(0.5);
                await clickAndFill("#a2rentAndServiceCharge", groundRentOrServiceCharge2, page); await asyncWait(0.5);
                await clickAndFill("#a2travel", travel2, page); await asyncWait(0.5);
            };
            //Scroll elements into view
            await page.mouse.wheel(0, 350); await asyncWait(actionDelay);
            ///Fill remaining childcare cost and other expenditure fields for both applicantst
            await clickAndFill("#a1childcareCosts", childCareCosts, page); await asyncWait(0.5);
            await clickAndFill("#a1otherExpenditure", otherExpenditure, page); await asyncWait(0.5);
            if (jointMortgage == "Joint") {
                await clickAndFill("#a2childcareCosts", childCareCosts2, page); await asyncWait(0.5);
                await clickAndFill("#a2otherExpenditure", otherExpenditure2, page); await asyncWait(0.5);
            }
            //click "Next"
            await clickElem("#expenditureNextBtn", page); await asyncWait(2);
            //Collect Result if error
            try {

                const errorElem = await page.$('#result-errors');
                if (errorElem != null || errorElem != undefined) {
                    const errorText = await errorElem.textContent();

                    await updateCsvColumn(csvPath, i, 48, errorText);

                }
            } catch (error) {
                console.error('Error element not found:', error);
            };
            //Collect Total loan Amount (TLA), Loan to Value(LTV), Total Loan Amount based on Affordability(TLAA)
            //45 correspondds to column position of result TLA field in CSV
            const tla = await page.$('#lendingBasedOnProperty');
            const tlaText = await tla.textContent();
            await updateCsvColumn(csvPath, i, 45, tlaText);
            //46 corresponds to column position of result LTV field in CSV
            const ltv = await page.$('#resultantLTV');
            const ltvText = await ltv.textContent();
            await updateCsvColumn(csvPath, i, 46, ltvText);
            //47 corresponds to column position of result TLAA field in CSV
            const tlaAffordability = await page.$('#lendingBasedOnAffordability');
            const tlaAffordabilityText = await tlaAffordability.textContent();
            await updateCsvColumn(csvPath, i, 47, tlaAffordabilityText);
            //Test success/fail condition: expected TLA, LTV & TLAA values inputted to CSV should match output values in CSV
            //49 corresponds to  column position of test status field in CSV
            if (tlaText == ExpectedTLA && ltvText == ExpectedLTV && tlaAffordabilityText == ExpectedTLAA) {
                await updateCsvColumn(csvPath, i, 49, "Success");
            } else {
                await updateCsvColumn(csvPath, i, 49, "Fail");
            }
            //Allows time for inspecting browser instances before closing. Increase asyncWait amount if required.
            await asyncWait(delayBeforeClosingInSeconds);

            await browser.close();
        })();

        promises.push(promise);
    }
    //complete all promises
    await Promise.all(promises);
}
//Run runs the main script
run();


