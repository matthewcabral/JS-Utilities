/*
    BS Name: ABC Generic Utilities
    BS Method: Query BusComp SearchExp

    BS Inputs/Outputs:
    Argument Name       |   Argument Type   |   Data Type   |   Comments
    ---------------------------------------------------------------------
    Business Object     |   Input           |   String      |   Business Object Name
    Business Component  |   Input           |   String      |   Business Component Name
    Field Name          |   Input           |   String      |   List of fields to get values from - Field Name(N). Ex.: Field Name: FieldName | Field Name1: FieldName1 | Field NameN: FieldNameN
    Search Expression   |   Input           |   String      |   Expression used to Search Records in Business Component. Ex: [Name] = 'Name' AND [Last Name] = 'Last Name'
    View Mode           |   Input           |   String      |   Optional: AllView is the Default Mode
    Cursor Mode         |   Input           |   String      |   Optional: ForwardOnly is the Default Cursor
    Field Out           |   Output          |   String      |   List of fields where each field is passed back in one equivalent Field Name(N) input argument Field Out(N). Ex.:Field Out: FieldValue | Field Out1: FieldValue1 | Field OutN: FieldValueN
    Error Code          |   Output          |   String      |   
    Error Message       |   Output          |   String      |   
*/

function QueryBusCompSearchExp(Inputs, Outputs) {
    try {
        var bo = TheApplication().GetBusObject(Inputs.GetProperty("Business Object"));
        var bc = bo.GetBusComp(Inputs.GetProperty("Business Component"));
        var searchExp = Inputs.GetProperty("Search Expression");
        var viewMode = Inputs.GetProperty("View Mode");
        var cursorMode = Inputs.GetProperty("Cursor Mode");
        var fieldName = "";
        var fieldNameArray = new Array();
        var loop = true;
        var i = 0;

        do {
            if (i < 1) {
                fieldName = Inputs.GetProperty("Field Name");
                if (fieldName != "" && fieldName != null) {
                    fieldNameArray.push(fieldName);
                    loop = true;
                } else {
                    loop = false;
                }
            } else {
                fieldName = Inputs.GetProperty("Field Name" + i);
                if (fieldName != "" && fieldName != null) {
                    fieldNameArray.push(fieldName);
                    loop = true;
                } else {
                    loop = false;
                }
            }
            i++;
        } while (loop);
        
        bc.ActivateField("Id");
        for (i = 0; i < fieldNameArray.length; i++) {
            bc.ActivateField(fieldNameArray[i]);
        }
        
        if (viewMode != "" && viewMode != null) {
            bc.SetViewMode(viewMode);
        } else {
            bc.SetViewMode(AllView);
        }
        
        bc.ClearToQuery();
        bc.SetSearchExpr(searchExp);
        
        if (cursorMode != "" && cursorMode != null) {
            bc.ExecuteQuery(cursorMode);
        } else {
            bc.ExecuteQuery(ForwardOnly);
        }

        if (bc.FirstRecord()) {
            Outputs.SetProperty("Id", bc.GetFieldValue("Id"));
            for (i = 0; i < fieldNameArray.length; i++) {
                if (i < 1) {
                    Outputs.SetProperty("Field Out", bc.GetFieldValue(fieldNameArray[i]));
                } else {
                    Outputs.SetProperty("Field Out" + i, bc.GetFieldValue(fieldNameArray[i]));
                }
            }
        } else {
            Outputs.SetProperty("Error Code", "01");
            Outputs.SetProperty("Error Message", "No record(s) exists for the current query");
        }
    } catch (e) {
        var codErr = "";
        var codTemp = Clib.strstr(e.toString(), "SBL-");
        Clib.strncat(codErr, codTemp, 13);

        switch (codErr) {
        case 'SBL-DAT-00144':
            Outputs.SetProperty("Error Code", "02");
            Outputs.SetProperty("Error Message", "Business Object not found. Please validate if BO name is correct. (SBL-DAT-00144)");
            break;
        case 'SBL-DAT-00222':
            Outputs.SetProperty("Error Code", "03");
            Outputs.SetProperty("Error Message", "Business Component not found. Please validate if BC name is correct. (SBL-DAT-00222)");
            break;
        case 'SBL-DAT-00398':
            Outputs.SetProperty("Error Code", "04");
            Outputs.SetProperty("Error Message", "Some Input Fields on SearchSpec doesn't exists for the specified Business Component. (SBL-DAT-00398)");
            break;
        case 'SBL-EXL-00119':
            Outputs.SetProperty("Error Code", "05");
            Outputs.SetProperty("Error Message", "One or more Fields of 'Field Name' input doesn't exists for the specified Business Component. (SBL-EXL-00119)");
            break;
        case 'SBL-GOL-1005':
            Outputs.SetProperty("Error Code", "06");
            Outputs.SetProperty("Error Message", "Unable to search the record(s), search criteria not provided. (SBL-GOL-1005)");
            break;
        default:
            Outputs.SetProperty("Error Code", "07");
            Outputs.SetProperty("Error Message", e);
            break;
        }
    } finally {
        bo = null;
        bc = null;
        searchExp = null;
        viewMode = null;
        cursorMode = null;
        fieldName = null;
        fieldNameArray = null;
        loop = null;
        i = null;
    }
}