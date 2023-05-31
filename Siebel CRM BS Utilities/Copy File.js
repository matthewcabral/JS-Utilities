/********************************************************************************
Function Name:	CopyFile
Inputs:
				File Name: FileName.txt
				Source Path: /interface/dir1/dir2/dir3/dir4/
				Dest Path: /interface/dir1/dir2/
Outputs:
				Output Command: cp '/interface/dir1/dir2/dir3/dir4/FileName.txt' '/interface/dir1/'
Description: 	Copy a file to a specific directory
********************************************************************************/

function CopyFile(Inputs, Outputs) {
	try {
		var fileName = Inputs.GetProperty("File Name");
       	var srcPath = Inputs.GetProperty("Source Path");
       	var destPath = Inputs.GetProperty("Dest Path");
       	var svrCmd = "";

		svrCmd += "cp '" + 
			(srcPath.substring(srcPath.length - 1, srcPath.length) === "/" ? srcPath : srcPath + "/") + 
			fileName + "' '" + 
			(destPath.substring(destPath.length - 1, destPath.length) === "/" ? destPath : destPath + "/") + 
			"'";
       	
       	Clib.system(svrCmd);

		Outputs.SetProperty("Output Command", svrCmd);
		Outputs.SetProperty("Error Code", "");
		Outputs.SetProperty("Error Message", "");
	} catch(e) {
		Outputs.SetProperty("Output Command", svrCmd);
		Outputs.SetProperty("Error Code", "01");
		Outputs.SetProperty("Error Message", e.toString());

		throw(e);
	} finally {
		fileName = null;
		srcPath = null;
		destPath = null;
		svrCmd = null;
	}
}