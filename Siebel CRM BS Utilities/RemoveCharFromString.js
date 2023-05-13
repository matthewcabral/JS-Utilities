/*
    BS Name: ABC Generic Utilities
    BS Method: RemoveCharFromString

    BS Inputs/Outputs:
    Argument Name   |   Argument Type   |   Data Type   |   Comments
    ----------------------------------------------------------------
    ChrToRemove     |   Input           |   String      |   Allows infinite Inputs, but accepts only 1 Char at a time. To do this, add a number to the end of the Property Name.
                                                            Ex.: ChrToRemove: , | ChrToRemove1: . | ChrToRemoveN: \
    ----------------------------------------------------------------
    InputString     |   Input           |   String      |   Allows infinite Inputs. To do this, add a number to the end of the Property Name.
                                                            Ex.: InputString: 10,90 | InputString1: 20.12 | InputStringN: Hello, World!
    ----------------------------------------------------------------
    OutputString    |   Output          |   String      |   The output is based on Inputs.
                                                            Ex.: InputString = OutputString | InputString1 = OutputString1 | InputStringN = OutputStringN
    ----------------------------------------------------------------
    Error Code      |   Output          |   String      |   
    Error Message    |   Output         |   String      |   
*/
/*
Inputs/Outputs Example:
Inputs:
	ChrToRemove: "," <- Without ""
    ChrToRemove1: "."
	InputString: 1,200.99
	InputString1: 1,2,345.99
Outputs:
	OutputString: 120099
	OutputString1: 1234599
*/
function RemoveCharFromString(Inputs, Outputs) {
    try {
        var ChrToRemove = "";
        var StringInput = "";
		var StringOutput = "";
		var loop = true;
		var loopChr = true;
        var a = 0;
		var i = 0;
		var j = 0;
        var outputArray = new Array();

        do{
            if(i < 1) {
                StringInput = Inputs.GetProperty("InputString");
            } else {
                StringInput = Inputs.GetProperty("InputString" + i);
            }
            StringOutput = "";

            if (StringInput != "" && StringInput != null) {
                j = 0;
                do{
                    if(j < 1) {
                        ChrToRemove = Inputs.GetProperty("ChrToRemove");
                    } else {
                        ChrToRemove = Inputs.GetProperty("ChrToRemove" + j);
                    }
    
                    if (ChrToRemove != "" && ChrToRemove != null) {
                        outputArray = [];
                        for(a = 0; a < StringInput.length; a++) {
                            if(StringInput[a] != null && StringInput[a] != ChrToRemove){
                                outputArray.push(StringInput[a]);
                            }
                        }
                        StringInput = "";
                        for(a = 0; a < outputArray.length; a++){
                            StringInput += outputArray[a];
                        }
                        loopChr = true;
                    } else {
                        loopChr = false;
                    }
                    j++;
                } while (loopChr);
                StringOutput = StringInput;

                if(i < 1) {
                    Outputs.SetProperty("OutputString", StringOutput);
                } else {
                    Outputs.SetProperty("OutputString" + i, StringOutput);
                }
                loop = true;
            } else {
                loop = false;
            }
            i++;
        } while (loop);
        Outputs.SetProperty("Error Code", "");
        Outputs.SetProperty("Error Message", "");
    } catch (e) {
        Outputs.SetProperty("Error Code", "01");
        Outputs.SetProperty("Error Message", e);
        throw e;
    } finally {
		ChrToRemove = null;
		StringInput = null;
        StringOutput = null;
		loop = null;
		loopChr = null;
        a = null;
		i = null;
		j = null;
        outputArray = null;
    }
}