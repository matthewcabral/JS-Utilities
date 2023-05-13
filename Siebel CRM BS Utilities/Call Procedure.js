/*
	BS Name: ABC Generic Utilities
    BS Method: CallProcedure

    BS Inputs/Outputs:
	Argument Name           |   Argument Type   |   Data Type   |   Comments
    ----------------------------------------------------------------
    CmdLine                 |   Input           |   String
    Process Instance Id     |   Input           |   String
    Result                  |   Output          |   
    
    Function Description:  Call a external stored procedure an get the return.

*/
function CallProcedure(Inputs, Outputs) {
    try {
        var cmd = Inputs.GetProperty("CmdLine");
        var processId = Inputs.GetProperty("Process Instance Id");
        
        Clib.remove(processId);        
        var exec = Clib.system(cmd); // Execute the Procedure
        
        var today = new Date;
        var timeNow = new Date;
        var secAhead = AddToDate(today, 0, 0, 0, 10, 1);

        // Execute a wait for FS refresh
        while (secAhead > timeNow) {
            timeNow = new Date;
        }

        var oFile = Clib.fopen(processId, "rt");

        if (null != oFile) {
            var line;
            var substr;
            
            if (null != (line = Clib.fgets(oFile))) {
                substr = Clib.strstr(line, "SUCESSO");
                if (substr != null) {
                    Outputs.SetProperty("Result", "OK");
                } else {
                    Outputs.SetProperty("Result", "NOK");
                }
            }

            line = null;
            substr = null;
            oFile = null;
        } else {
            Outputs.SetProperty("Result", "NOK");
        }

    } catch (e) {
        throw (e);
    } finally {
        today = null;
        secAhead = null;
        cmd = null;
        exec = null;
        processId = null;
    }
}