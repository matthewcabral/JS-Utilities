/*
Function Name:	isEmptyFile
Inputs:
				Filename
				Path
Outputs:		Result
Description: 	Verify if a interface file is empty
*/
function IsEmptyFile(Inputs, Outputs) {
	try {
		var fileName = Inputs.GetProperty("File Name");
		var path = Inputs.GetProperty("Path");
		var strBOF = "False";
		var strEOF = "False";
		var i = 0;
		var line;
		var substr;
		var oFile = null;
		
		oFile = Clib.fopen((path.substring(path.length - 1, path.length) === "/" ? path : path + "/") + fileName, "r");

		if (oFile != null) {
			while (null != (line = Clib.fgets(oFile))) {
				i++;
				substr = Clib.strstr(line, "BOF#");
				
				if (substr != null) {
					strBOF = "True";
				}

				substr = Clib.strstr(line, "EOF#");
				
				if (substr != null && i == 2 && strBOF == "True") {
					strEOF = "True";
					Outputs.SetProperty("Result", "OK");
				}
			}

			Clib.fclose(oFile);

			substr = null;
			line = null;
			oFile = null;
		}
	} catch (e) {
		Outputs.SetProperty("Result", e.errText);
	} finally {
		fileName = null;
	}
}
