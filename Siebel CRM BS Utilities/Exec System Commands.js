/*
	BS Name: ABC Generic Utilities
    BS Method: ExecSystemCmd

    BS Inputs/Outputs:
	Argument Name   |   Argument Type   |   Data Type   |   Comments
    ----------------------------------------------------------------
	Command			|	Input			|	String 		|

	Description: This function executes any UNIX commands
*/
function ExecSystemCmd (Inputs,Outputs) {
	try {		
		var result;
       	var cmd = Inputs.GetProperty("Command");	

       	result = Clib.system(cmd);
       	
       	Outputs.SetProperty("Result", result);
	} catch(e) {
		throw(e);
	} finally {
		result = null;
       	cmd = null;
	}
}