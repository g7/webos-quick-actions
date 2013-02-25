enyo.kind({
    name: "Launcher",
    kind: enyo.Control,
    published: {
		homebrewEnabled: null,
		actionArgs: null,
		currentAction: null,
	},
    components: [
		{kind: "ApplicationEvents", onApplicationRelaunch: "ready"},
		{kind: "DbService", name: "dbService", dbKind: "eu.medesimo.quickactions:1", onFailure: "dbNonExistent", components: [
			{name: "dbCreate", method: "putKind", onSuccess: "createDBsuccess"},
			{name: "dbGet", method: "get"},
			{name: "dbFind", method: "find", onResponse: "listQueryResponse"},
			{name: "dbDel", method: "del", onSuccess: "deletedResponse"},
			{name: "dbPut", method: "put", onSuccess: "addedResponse"},
			{name: "dbMerge", method: "merge"}
		]},
	],
	
    ready: function() {
				
        if(!enyo.windowParams.execute && !enyo.windowParams.execute_from_search) {
			// We need to launch our GUI...
			enyo.windows.activate("app.html", "", enyo.windowParams);
		} else {
			// Called from just type or from a service: we need to actually executing things while being in the dark :)
			enyo.windows.activate("dashboard.html", "QuickActions.Dashboard", enyo.windowParams, inAttributes={"noWindow": true});
			enyo.windows.deactivate("QuickActions.Dashboard");
		}
	},

});
