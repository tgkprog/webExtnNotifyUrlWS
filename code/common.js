//common fns used by other js fns

/*function escapeHTML(str)  str.replace(/[&"<>]/g, function (m) escapeHTML.replacements[m]);
escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" };
*/



function escapeHTML(unsafe) {
	unsafe = unsafe + "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }




function sendReqGetQuiet(s1, s2){
	var oReq1 = new XMLHttpRequest();								
	oReq1.open("GET", "http://localhost:8080/urlConsumer/?p=s1_" + escapeHTML("" + s1) + "_s2_" + escapeHTML("" + s2));
	oReq1.send(null);
}
