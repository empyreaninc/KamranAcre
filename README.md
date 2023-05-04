
# Kamran Acre

A table testing tool for the HSBC Mortgage Affordability Calculator. The script uses inputs as defined in "testinputs.csv" to fill out the form using Playwright for robotic process automation(RPA). All UI interactions & simulated test actions are handled by the script. Results are recorded and validated for success/failure in comparison to expected values, and will record conventional result error message if available. The test script will run as many instances as scenarios that have been filled out in the CSV, system resources permitting. Scenarios can be filled in according to the "Running Tests" section at the end.




## Installation

Install Kamran Acre Affordability Calculator with npm.
Project can be ran from inside IDE by opening the project directory and running ```node main.js ```, or by following the steps to compile as detailed below:

1. Create a new, empty folder that you can access without elevated permissions(for most compatibility)

```bash
cd desktop
  mkdir KamranAcre
```
2. Clone repo inside newly created folder

```bash
cd KamranAcre
git clone https://github.com/empyreaninc/KamranAcre.git
```
3. Install dependenices
```bash
npm install
```
4. Compile for executable(complete from root directory of project)
```bash
npm run build
```
or
```bash
pkg .
```
On MacOS you may aslso have to use 
```bash
chmod +x kamran-acre-macos
```
 to make the compiled item into an executable.

5. Use executable as normal. MacOS may require 
```bash
sudo ./kamran-acre-macos
``` 
to launch with correct permissions.


## Requirements
- Ensure you have node.js installed on the machine in use. May require latest node version if you run into issues compiling. 
- Ensure you have git installed on the machine in use, or download the project via github repo as zip.
- Should you encounter issues with regards to ```npm run build``` you may need to add npm or pkg to PATH. 


## Usage - Settings

Usage of the project consists of the use of 3 files. Settings.json, testinputs.csv and the main executable. 

Settings.json consists of 3 user configurable options: 
```
{
    "Headless": false,
    "ActionDelay": 0.5,
    "DelayBeforeClosingInSeconds": 30
}
```
- "Headless" | true or false, will inform whether browser instances are headful or headless

- "ActionDelay" | will inform the default time frame between actions such as clicking on elements or typing. Default 0.5, it is recommended to increase delay to 1 or 1.5 if machine performance issues hinder correct script execution in any way.

- "DelayBeforeClosingInSeconds" | will inform the delay before closing the browser instances after they complete script execution. Intended for inspecting browser for results/any other observations one may wish to make before the instances are closed.




## Usage - Test Inputs CSV

As the script is filling out a mortgage application, there are a large number of fields that can be filled out. Some fields are mandatory and will be marked by an asterisk(*). The rest of the fields are optional to fill. Where an application is marked as "Sole" rather than "Joint", fields you have filled out pertaining to the information of the second applicant will be ignored as per the script logic, which was designed relative to the form logic. 6 application scenarios (one of which is an intentionally failing test to capture error messages) have been filled out as examples, but please refer to this guide if you are unsure on a particular field's input. As mentioned in the description of the project, it will run as many instances as tasks you have filled, so feel free to add or remove tasks as appropriate. Please input the options as presented below, sans the [] square brackets.

TEST RESULTS can be viewed inside the CSV. It will validate output results vs inputted expected results, "Test Status" success or fail indicates whether nor not expected and real values are identical.

Clear TLA, LTV, TLAA, Error Text and Test Status columns before running to ensure no issues, though the script should overwrite the value of these cells regardless.

ENTER NUMERICAL AMOUNTS WITHOUT COMMAS OR YOU RISK BREAKING THE CSV.


*Asterisk = required


- Purchaser Type*: 
[Buying first house]

[Buying a house - moving]

[Moving to HSBC]

- Joint Mortgage*: 
[Joint]

[Sole]

- Maximum LTV*:
[<=85]
[>85]

- Applicant 1's Age
[18+]

- Employment Status (1) (Defaults to Unknown if empty)
[Unknown]

[Employed] 

[Self-employed]

[Homemaker]

[Receiving Pension / Disability Benefit]

[Student]
 
[Key/Part-time]

[Unemployed]

- Applicant 2's Age (If Joint)
[18+]

- Employment Status (2) (If Joint)

[Unknown]

[Employed] 

[Self-employed]

[Homemaker]

[Receiving Pension / Disability Benefit]

[Student]
 
[Key/Part-time]

[Unemployed]
	
- Marital Status*
[Single]

[Living Together]

[Married/Civil Partnership] 

[Divorced]

[Widowed] 

[Separated] 


- No Dependant Children

[0+]

- No Dependant Adults

[0+]

- Deposit Amount (optional)

[Numerical]

- Loan Amount (optional)

[Numerical]

- Property Value (optional)

[Numerical]

- The required mortgage term(s) (in years)*
[5+, Must be 25 or less if Assessing on interest only]


- (Yes/No) Assess On Interest Only Basis*
[Yes]

[No]

- Property Postcode*

[First 2 chars minimum eg E1]

- Gross Income

[Numerical]

- Additional Income

[Numerical]

- Limited Company Net profits

[Numerical]

- Other Non Taxable Income

[Numerical]

- Existing BTL Rental Income

[Numerical]

- Gross Income (2)

[Numerical]

- Additional Income (2)

[Numerical]

- Limited Company Net profits (2)

[Numerical]

- Other Non Taxable Income (2)

[Numerical]

- Existing BTL Rental Income (2)

[Numerical]

- Existing Monthly BTL Outgoings

[Numerical]

- Total Monthly Loan Payments (excl Student Loans)

[Numerical]

- Credit Cards

[Numerical]

- Ground Rent / Service Charge

[Numerical]

- Travel

[Numerical]

- Child Care Costs

[Numerical]

- Other Expenditure

[Numerical]

- Existing Monthly BTL Outgoings (2)

[Numerical]

- Total Monthly Loan Payments (excl Student Loans) (2)

[Numerical]

- Credit Cards (2)

[Numerical]

- Ground Rent / Service Charge (2)

[Numerical]

- Travel (2)

[Numerical]

- Child Care Costs (2)

[Numerical]

- Other Expenditure (2)

[Numerical]

- Link

[Link to calculator you want to test]

- Expected TLA

[Numerical]

- Expected LTV

[Numerical 0-100]

- Expected TLAA 

[Numerical]

- TLA

[result field, don't fill]

- LTV

[result field, don't fill]

- TLAA

[result field, don't fill]

- Error Text

[result field, don't fill]

- Test Status

[result field, don't fill]


## Maintainability (for contributors)

Certain choices were made to ensure the script is expandable. 
Some parameters have been made configurable through settings.json to prevent updates from require repetitve changes such as editing hundreds of delay values. The link is taken from the CSV in case other calculators + scripts for them are added, making the CSV plug and go. Main script is contained within the run() function so that scripts for other calculators can be built, added and ran through similar function calls. 
