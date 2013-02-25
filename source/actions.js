actions = {
	"Web": {
		"isHomebrew": false,
		"method": "launch",
		"id": "com.palm.app.browser",
		"container": [
			{name: "WEB_help", content: "<b>" + $L("Insert the website you'd like to open at action execution.<br />Arguments are supported, see the Help.<br /><br />For example: <i>http://www.google.it/search?q=@join(+)@</i>") + "</b>"},
			{name: "WEB_content", autocorrect: false, autoCapitalize: "lowercase", kind: "RichText", richContent: false, hint: $L("Insert here the webpage to open"), onchange: "doSaveData"},
		],
		"show": webShow,
		"populate": webPopulate,
		"save": webSave,
		"execute": webExecute
	},
	"Launch": {
		"isHomebrew": false,
		"method": "custom",
		"container": [
			{name: "LAUNCH_help", content: "<b>" + $L("Insert the ID of the application you'd like to open.<br />Arguments are supported, see the Help.<br /><br />Some examples:<br /><i>com.palm.app.browser</i> - Opens the browser application<br /><i>@1@</i> - Opens the application passed as the first argument (see the Help)") + "</b>"},
			{name: "LAUNCH_id", autocorrect: false, autoCapitalize: "lowercase", kind: "RichText", richContent: false, hint: $L("Insert the application ID to open"), onchange: "doSaveData"},
		],
		"show": launchShow,
		"populate": launchPopulate,
		"save": launchSave,
		"execute": launchExecute
	},
	"Launch (advanced)": {
		"isHomebrew": false,
		"method": "custom",
		"container": [
			{name: "LADV_helpbase", content: $L("This action permits to launch an application and pass one parameter to it.<br />Parameters vary from application to application.<br />Refer to the to-be-launched application developer for more details.")},
			{name: "LADV_help", content: "<b>" + $L("Insert the ID of the application you'd like to open.<br />Arguments are supported, see the Help.<br /><br />Some examples:<br /><i>com.palm.app.browser</i> - Opens the browser application<br /><i>@1@</i> - Opens the application passed as the first argument (see the Help)") + "</b>"},
			{name: "LADV_id", autocorrect: false, autoCapitalize: "lowercase", kind: "RichText", richContent: false, hint: $L("Insert the application ID to open"), onchange: "doSaveData"},
			{name: "LADV_help2", content: "<b>" + $L("Insert the parameter NAME to pass to the application.<br />Arguments are supported, see the Help.<br /><br />For example:<br /><i>target</i> - Use the parameter name 'target'") + "</b>"},
			{name: "LADV_arg", autocorrect: false, autoCapitalize: "lowercase", kind: "RichText", richContent: false, hint: $L("Insert the parameter name"), onchange: "doSaveData"},
			{name: "LADV_help3", content: "<b>" + $L("Insert the parameter VALUE to pass to the application.<br />Arguments are supported, see the Help.<br /><br />For example:<br /><i>http://semplice-linux.org</i> - Use the parameter value 'http://semplice-linux.org'") + "</b>"},
			{name: "LADV_val", autocorrect: false, autoCapitalize: "lowercase", kind: "RichText", richContent: false, hint: $L("Insert the parameter value"), onchange: "doSaveData"},
		],
		"show": launchAdvShow,
		"populate": launchAdvPopulate,
		"save": launchAdvSave,
		"execute": launchAdvExecute
	},
//	"Airplane": {
//		"isHomebrew": false,
//		"method": "custom",
//		"container": [
//			{name: "AIRPLANE_help", content: "<b>" + $L("This action enables/disables the Airplane mode of your device.<br /><br />Call this action with the 'on' or 'off' arguments to enable or disable it.<br /><br />For example (if action name is <i>airplane</i>):<br /><i>airplane on</i> - Enables airplane mode<br /><i>airplane off</i> - Disables airplane mode") + "</b>"},
//		],
//		"show": dummy,
//		"populate": dummy,
//		"save": dummy,
//		"execute": airplaneNormalExecute
//	},
		
};

function dummy() {
	// nothing to do
	console.log("Dummy!");
};

function parseString(string, arg1) {
	// parses string with args.

	var args = arg1.slice(0); // Copy arg1, otherwise we won't be able to run parseString more than one time.

	// Parse args
	var num = -1;
	var target = string;
		
	
	for(var current in args) {
		num = num + 1;
		target = target.replace(new RegExp("@" + num.toString() + "@", "g"), args[current]);
	}
	// @*@ is an alias for @join( )@
	target = target.replace(/\@\*\@/g, "@join( )@");
	
	// Ensure we delete @0@
	app = args.splice(0, 1);
	
	// Parse @join()@
	splt = target.split("@")
	var trg = ""
	for(var item in splt) {
		if(splt[item].indexOf("shift(") != -1) {
			_item = splt[item].replace("shift(","").replace(")","");
			if(_item == "") { _item = 1 };
			
			_item = parseInt(_item);
			
			removed = args.splice(0, _item);
		} else if(splt[item].indexOf("join(") != -1) {
			_item = splt[item].replace("join(","").replace(")","");
			
			trg = trg + args.join(_item);
		} else {
			trg = trg + splt[item];
		}
	}
	
	return trg
		
	
};

function webShow(caller, objs) {
	// sample objs: {"webpage": "http://medesimo.eu"}
	
	// We should handle empty objs too, as this may be the default item.
	if(objs["webpage"] != undefined) {
		caller.$.QuickShow.$.WEB_content.setValue(objs["webpage"]);
	}
};

function webPopulate(caller, record) {
	caller.$.QuickShow.$.content.setValue(record.webpage);
};

function webSave(caller) {
	var inSave = {"webpage": caller.$.QuickShow.$.WEB_content.getValue()};
	
	return inSave
};

function webExecute(caller, object, args) {

	return {"target": parseString(object["webpage"], args)};
};

function launchShow(caller, objs) {
	// sample objs: {"webpage": "http://medesimo.eu"}
	
	caller.$.QuickShow.$.LAUNCH_id.setValue(objs["id"]);
};

function launchPopulate(caller, record) {
	caller.$.QuickShow.$.content.setValue(record.id);
};

function launchSave(caller) {
	var inSave = {"id": caller.$.QuickShow.$.LAUNCH_id.getValue()};
	
	return inSave
};

function launchExecute(caller, object, args) {

	var id = parseString(object["id"], args);

	caller.$.applicationManager.call({"id": id});
};

function launchAdvShow(caller, objs) {
	// sample objs: {"webpage": "http://medesimo.eu"}
	
	caller.$.QuickShow.$.LADV_id.setValue(objs["id"]);
	caller.$.QuickShow.$.LADV_arg.setValue(objs["arg"]);
	caller.$.QuickShow.$.LADV_val.setValue(objs["val"]);

};

function launchAdvPopulate(caller, record) {
	caller.$.QuickShow.$.content.setValue(record.id);
};

function launchAdvSave(caller) {
	var inSave = {"id": caller.$.QuickShow.$.LADV_id.getValue(), "arg": caller.$.QuickShow.$.LADV_arg.getValue(), "val": caller.$.QuickShow.$.LADV_val.getValue()};
	
	return inSave
};

function launchAdvExecute(caller, object, args) {

	var id = parseString(object["id"], args);
	var arg = parseString(object["arg"], args);
	var val = parseString(object["val"], args);
	
	var params = {}
	params[arg] = val
	
	caller.$.applicationManager.call({"id": id, "params": params});
};

function airplaneNormalExecute(caller, object, args) {
	
	var stat = parseString("@1@", args);
	if(stat == "off") {
		stat = false;
	} else { stat = true; }
	
	caller.$.systemService.call({airplaneMode: stat}, {"method": "setPreferences"});
};
