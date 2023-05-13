/*
    BS Name: ABC Generic Utilities
    BS Method: Get Actual Date
    
    BS Inputs/Outputs:
        Argument Name   |   Argument Type   |   Data Type
        ------------------------------------------------------
        Day             |   Output          |   String
        Month           |   Output          |   String
        Year            |   Output          |   String
        Year2Digits     |   Output          |   String
*/

function getActualDate(Inputs, Outputs) {
	var oDate = new Date;
	var oDay = oDate.getDate();
	var oMonth = oDate.getMonth() + 1;
	var oYear = oDate.getFullYear();
	
	Outputs.SetProperty("Day", oDay.toString());
	Outputs.SetProperty("Month", oMonth.toString());
	Outputs.SetProperty("Year", oYear.toString());
	Outputs.SetProperty("Year2Digits", (oYear.toString()).substring(2, 4));
}