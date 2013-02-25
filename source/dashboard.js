enyo.kind({
    name: "QuickActions.Dashboard",
    kind: enyo.Control,
    published: {
		launchParams: null,
		homebrewEnabled: null,
		actionArgs: null,
		currentAction: null,
	},
    components: [
		{style: "font-size: 1.1em; text-align: center", className: "enyo-item enyo-first", components: [
			{content: $L("Executing your action... please wait :-)")}
		]},
		{content: "<br /><br />"},
		{style: "text-align: center", components: [{content: $L("If this window does not close automatically, something went wrong.<br />Please recheck your action and its arguments.")}]},
		{kind: "DbService", name: "dbService", dbKind: "eu.medesimo.quickactions:1", onFailure: "dbNonExistent", components: [
			{name: "dbCreate", method: "putKind", onSuccess: "createDBsuccess"},
			{name: "dbGet", method: "get"},
			{name: "dbFind", method: "find", onResponse: "listQueryResponse"},
			{name: "dbDel", method: "del", onSuccess: "deletedResponse"},
			{name: "dbPut", method: "put", onSuccess: "addedResponse"},
			{name: "dbMerge", method: "merge"}
		]},
//		{
//			name: "homebrewService",
//			kind: enyo.PalmService,
//			service: "palm://eu.medesimo.quickactions.service.service/"
//		},
		{
			name: "applicationManager",
			kind: "PalmService",
			service: "palm://com.palm.applicationManager/",
			method: "launch",
			onSuccess: "launchSuccess",
			onFailure: "launchFail",
			onResponse: "launchResponse",
			subscribe: true
		},
		{
			name: "systemService",
			kind: "PalmService",
			service: "palm://com.palm.systemservice/",
			onSuccess: "launchSuccess",
			onFailure: "launchFail",
			onResponse: "launchResponse",
		},
	],

	/* Homebrew service */
	homebrewEnabled: function() {
		// Homebrew is enabled.
		this.setHomebrewEnabled(true);
	},
	
	homebrewDisabled: function() {
		// Homebrew is disabled.
		this.setHomebrewEnabled(false);
	},
	/* End homebrew service */

//	create: function() {
//		console.log("CREATE");
//	},


    ready: function() {	
		this.actually_do_the_cool_things_yay();
	},
	
	parseArgs: function() {
		if (enyo.windowParams){
			if (enyo.windowParams.execute){
				// Store arguments
				this.setActionArgs(enyo.windowParams.execute.split(" "));
								
				// Query.
				var inQuery = {"from":"eu.medesimo.quickactions:1", "where":[{"prop":"name","op":"=","val":this.actionArgs[0],"collate":"primary", "tokenize":"all"}],"orderBy":"name"}
				this.$.dbFind.call({query: inQuery}, {onSuccess: "executeAction", onFailure: "actionQueryFail"});
			} else if (enyo.windowParams.execute_from_search) {
				// Store arguments
				this.setActionArgs([enyo.windowParams.execute_from_search]);
								
				// Query.
				var inQuery = {"from":"eu.medesimo.quickactions:1","where":[{"prop":"_id","op":"=","val":this.actionArgs[0]}]};
				this.$.dbFind.call({query: inQuery}, {onSuccess: "executeAction", onFailure: "actionQueryFail"});	
			}
				
		}
	},
	
	actually_do_the_cool_things_yay: function() {
		// See if the homebrew service is installed/enabled...
		//this.$.homebrewService.call({}, {method: "isInstalled", onSuccess: "homebrewEnabled", onFailure: "homebrewDisabled"});
		this.setHomebrewEnabled(false);

		// Parse arguments
		this.parseArgs();

    },

	executeAction: function(inSender, inResponse, inRequest) {
		// The core function: executes the action!
		
		resp = inResponse.results[0]
		if (!resp.type) {
			return;
		}
		if (!resp.objects) {
			return;
		}
		
		this.setCurrentAction(actions[resp.type]);
		
		if (this.currentAction["isHomebrew"] == true) {
			// It is homebrew. Use only the service. Delegate the question to the action execute function.
			
			this.currentAction["execute"](this, resp.objects, this.getActionArgs());
		} else {
		// We should use ApplicationManager?
			if (this.currentAction["method"] == "launch") {
				// Yes.
				
				id = this.currentAction["id"];
				
				// Get a proper params object...
				params = this.currentAction["execute"](this, resp.objects, this.getActionArgs());
							
				// Finally launch
				this.$.applicationManager.call({"id": id, "params": params});
			} else if(this.currentAction["method"] == "custom") {
				// custom.
				
				this.currentAction["execute"](this, resp.objects, this.getActionArgs());
			}
		}
	},
	
	launchSuccess: function() {
		// Success!!! We can quit
		window.close();
	},
	
	launchFail: function() {
		// Called when a launch has been failed.
		console.error("Failed to launch application!");
		//enyo.windows.openPopup();
	},

});
