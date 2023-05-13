/*
    CONTEXT:
        This function was designed to "fulfill" the requirements of a project, which involves generating various sequences for different types of cases and utilizing the year to enable users to identify when each case was opened.

    DESCRIPTION:
        This is a simple function to create a custom sequence where depending on the value returned by the LookUp function "HLS_CASE_TYPE" different values are used to differentiate the case type.
        Eg.:
        if the HLS_CASE_TYPE = Regular, the sequence will look like this:
            300-12345-23 - Where "300" is the number chosen to represent the "Regular" case, "12345" is the sequence number and "23" represents the 2 last digit of the year the case was opened.
        else:
            500-12345-23 - Where "500" is the number chosen to represent "Other types of cases".
    
    USAGE:
        Designed to be used in Siebel CRM System.
        
        Need to create 3 system Preferences:
            One to Lock/Unlock the Sequence generation
            One to save the last sequence number
            One to save the year and compare if the current year is equal the saved year (if not, updates the year and reset the sequence)
        You can remove the concatenation and variable declaration for the following variables:
            hlsType
            hlsTypeNum

    INPUTS/OUTPUTS:
        Argument Name: finalFileNumber
        Argument Type: Output
        Data Type: String

*/

function getSequece() {
    var oBOSysPref = TheApplication.GetBusObject("System Preferences");
    var oBCSysPref = oBOSysPref.GetBusComp("System Preferences");

    var isSysPrefLocked = null;
    var FNumSeq = 0;
    var FNumYearCheck = null;

    var oDate = new Date;
    var oYear = (oDate.getFullYear()).toString();

    var hlsType = this.GetFieldValue("Type");
    var hlsTypeNum = "300";

    var finalFileNumber = "";
    var tryAgain = false;
    var tryCount = 0;

    try {
        if(hlsType == TheApplication().InvokeMethod("LookupValue", "HLS_CASE_TYPE", "Regular")) {
            hlsTypeNum = "500";
        }

        with (oBCSysPref) {
            do {
                SetViewMode(AllView);
                ActivateField("Name");
                ActivateField("Value");
                ClearToQuery();

                SetSearchSpec("Name", "FROFileNumberLocker"); // System Preference used to prevent 2 or more process get the same number
                ExecuteQuery(ForwardOnly);

                if (FirstRecord()) {
                    isSysPrefLocked = oBCSysPref.GetFieldValue("Value");

                    if (isSysPrefLocked == "N" || isSysPrefLocked == null) { // if the System Preference is locked, we try again 2 more times before return an error
                        SetFieldValue("Value", "Y");
                        WriteRecord();

                        ClearToQuery();
                        SetSearchSpec("Name", "FROFileNumberYear"); // System Preference to get the year stored and compare if the current year = stored year
                        ExecuteQuery(ForwardOnly);

                        if (FirstRecord()) {
                            FNumYearCheck = oBCSysPref.GetFieldValue("Value");

                            if (FNumYearCheck == oYear) { // If current year = stored year : get the last sequence number stored
                                ClearToQuery();
                                SetSearchSpec("Name", "FROFileNumberSeq");
                                ExecuteQuery(ForwardOnly);

                                if (FirstRecord()) {
                                    FNumSeq = parseInt(oBCSysPref.GetFieldValue("Value"));
                                }
                            } else { // If not, we update the year stored and reset the sequence to 0
                                SetFieldValue("Value", oYear);
                                WriteRecord();

                                ClearToQuery();
                                SetSearchSpec("Name", "FROFileNumberSeq");
                                ExecuteQuery(ForwardOnly);

                                if (FirstRecord()) {
                                    SetFieldValue("Value", "0");
                                    WriteRecord();

                                    FNumSeq = 0;
                                }
                            }                            
                        }
                        tryAgain = false;
                    } else {
                        if(tryCount < 3) {
                            wait(5000); // wait for 5s before continuing
                            tryAgain = true;
                        } else {
                            tryAgain = false;
                        }
                    }
                } else {
                    tryAgain = false;
                }
                tryCount++;
            } while(tryAgain);
        }

        FNumSeq++;
        finalFileNumber += hlsTypeNum + "-" + ("00000".substring(0, 5 - (FNumSeq.toString()).length)) + FNumSeq.toString() + "-" + oYear.substring(2, 4);

        this.ActivateField("FRO File Number");
        this.SetFieldValue("FRO File Number", finalFileNumber);

        // Update the System Preference "FROFileNumberSeq" to the new value
        with (oBCSysPref) {
            SetViewMode(AllView);
            ActivateField("Name");
            ActivateField("Value");
            ClearToQuery();

            SetSearchSpec("Name", "FROFileNumberSeq");
            ExecuteQuery(ForwardOnly);

            if (FirstRecord()) {
                SetFieldValue("Value", FNumSeq);
                WriteRecord();
            }
        }

    } catch (e) {
        alert(e.toString());
    } finally {
        // Restore the System Preference "FROFileNumberLocker" to N
        with (oBCSysPref) {
            SetViewMode(AllView);
            ActivateField("Name");
            ActivateField("Value");
            ClearToQuery();

            SetSearchSpec("Name", "FROFileNumberLocker");
            ExecuteQuery(ForwardOnly);
            if (FirstRecord()) {
                SetFieldValue("Value", "N");
                WriteRecord();
            }
        }

        oBOSysPref = null;
        oBCSysPref = null;
    }
}