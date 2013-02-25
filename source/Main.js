enyo.kind({
	name: "QuickActions.Main",
	kind: enyo.VFlexBox,
	published: {
		homebrewEnabled: null,
		actionArgs: null,
		lastGot: null,
		currentRecord: null,
		currentAction: null,
		currentCodice: null,
		launchParams: null
	},
	components: [
		{kind: "AppMenu", components: [
			{kind: "EditMenu"},
			{caption: $L("About"), onclick: "openAboutPopup"},
			{caption: $L("Help"), onclick: "openHelpPopup"},
		]},
		{kind: "Popup", name: "AboutPopup", components: [
			{content: $L("webOS Quick Actions by Eugenio Paolantonio.") + "<br /><br />"},
			{content: "<a href='http://medesimo.eu'>medesimo.eu</a> - <a href='mailto:me@medesimo.eu'>me@medesimo.eu</a>"},
		]},
		{kind: "ModalDialog", layoutKind:"VFlexLayout", name: "HelpPopup", contentHeight:"100%", style:"width:80%; height:80%;", components: [
			{kind: "Scroller", flex: 1, components: [
			{content: $L("<h1>Help</h1>")},
			{content: $L("webOS Quick Actions permits to use Just Type to accomplish different things.<br /><br />")},
			{content: $L("<h3>Configuring Just Type</h3>")},
			{content: $L("Open the Just Type preferences (you'll find it into the <b>System</b> tab of your Launcher), then enable/add the webOS Quick Actions items on <b>'Content'</b> and <b>'Actions'</b>.")},
			{content: $L("You are now ready to use webOS Quick Actions! Use the <b>Add</b> button on the application (the one on the toolbar) to add a new action.")},
			{content: $L("After adding the action, you can call it via just type. If the action does not appear (due to arguments), use the <b>'Execute Quick Action'</b> item.")},
			{content: $L("<h3>Supported actions</h3>")},
			{content: $L("Currently, the following <b>actions</b> are supported:<br /><br /><ul><li>Web</li><li>Launch</li><li>Launch (advanced)</li></ul>")},
			{content: $L("When selecting an action, an Help message for it appears.")},
			{content: $L("To configure actions beahviour, you can use <b>arguments</b>. Arguments are simply the words passed at the Just Type input box.")},
			{content: $L("For example, when writing in Just Type <i>'myaction arg1 arg2'</i>, the arguments are 'arg1' and 'arg2'.")},
			{content: $L("<h3>Arguments and other advanced things</h3>")},
			{content: $L("Arguments are referred on webOS Quick Actions with <b>@number@</b>. So, <i>'arg1'</i> in the previous example would be <b>'@1@'</b>.")},
			{content: $L("Every argument can be get with this notation (also, the action <b>name</b> can be obtained with <b>@0@</b>).")},
			{content: $L("<h4>Joining</h4>")},
			{content: $L("All arguments can be 'joined' so they can be grouped using a common delimiter. You can use <b>@join(delimiter)@</b> to do so.")},
			{content: $L("For example, <b>@join(+)@</b> will join every argument passed (@1@, @2@, etc) with the <i>'+'</i> delimiter.")},
			{content: $L("So, if from Just Type you passed <i>'myaction arg1 arg2'</i>, you'll get <u>'arg1+arg2'</u>.")},
			{content: $L("A shortcut for @join( )@ (joining with a space as delimiter) is <b>@*@</b>")},
			{content: $L("Following the previous example, <b>@*@</b> will translate to <u>'arg1 arg2'</u>")},
			{content: $L("<h4>Shifting</h4>")},
			{content: $L("Shifting an argument will simply remove it from the list (from the start).")},
			{content: $L("Just Type example: <i>'myaction arg1 arg2 arg3 arg4'</i>")},
			{content: $L("In this case, @1@ is 'arg1'. If we use <b>@shift()@</b>, arg1 is removed and, when joining, you'll not get it.")},
			{content: $L("<b>NOTE:</b> You'll still get the argument using @1@! This only affects joining. A join made <b>BEFORE</b> the shift will show the first argument, too.")},
			{content: $L("To shift more than one arguments, you can use <b>@shift(number)@</b>, for example: <b>@shift(2)@</b>")},
			]},
			{layoutKind: "HFlexLayout", pack: "center", components: [
				{kind: "Button", caption: $L("Close"), onclick: "closeHelp"},
			]}
		]},
		{kind: enyo.ApplicationEvents, onBack: "goBack"},
		{kind: "DbService", name: "dbService", dbKind: "eu.medesimo.quickactions:1", onFailure: "dbNonExistent", components: [
			{name: "dbCreate", method: "putKind", onSuccess: "createDBsuccess"},
			{name: "dbGet", method: "get"},
			{name: "dbFind", method: "find", onResponse: "listQueryResponse"},
			{name: "dbDel", method: "del", onSuccess: "deletedResponse"},
			{name: "dbPut", method: "put", onSuccess: "addedResponse"},
			{name: "dbMerge", method: "merge"}
		]},
		{kind: "SlidingPane", flex: 1, multiViewMinWidth: 480,onSelect: "paneSelected", name: "mainSliding",
			components: [
				{name: "QuickList", "width": "30%", kind: "QuickActions.List", onListTap: "showAction", onDeleteAction: "deleteAction", onNewActionTap: "addNewAction"},
				{name: "QuickShow", kind: "QuickActions.Show", onSaveData: "doSave", onGenerateCodice: "generateCodice", onClipboardCopy: "clipboardCopy"}
		]},
		{
			name: "putDBPermissions", 
			kind: enyo.PalmService,
		    service: "palm://com.palm.db/",
		    method: "putPermissions",
		    onSuccess: "permissionSuccess",
		    onFailure: "permissionFailure",
		},
//		{
//			name: "homebrewService",
//			kind: enyo.PalmService,
//			service: "palm://com.palm.eu.medesimo.quickactions.service/",
//			method: "isInstalled",
//			onSuccess: "homebrewEnabled",
//			onFailure: "homebrewDisabled",
//		},
	],

	/* General events and overrides */
	goBack: function(inSender, inEvent) {
		this.$.mainSliding.back(inEvent);
		inEvent.stopPropagation();
	},

	ready: function() {
		if (screen.width <= 640) {
			// block orientation on phones
			enyo.setAllowedOrientation("up");
		}
	
		this.$.QuickShow.$.row_general.hide();
		this.$.QuickShow.$.row_type.hide();
	
		// build actionPicker
		this.getActions();
		
		// See if the homebrew service is installed/enabled...
		//this.$.homebrewService.call();
		this.setHomebrewEnabled(false);

	},

	create: function() {
		this.inherited(arguments);
	},
	/* End general events and overrides */


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


	/* Database-related functions (permissions, installers, events) */
	permissionSuccess: function(){
		console.log("DB permission granted successfully!");
	},
	
	permissionFailure: function(){
		console.log("DB failed to grant permissions!");
	},
		
	listQueryResponse: function(inSender, inResponse, inRequest) {
		this.$.QuickList.$.actionList.queryResponse(inResponse, inRequest);
	},

	dbNonExistent: function() {
		// some check?
		// install db
		this.createDB();
	},
	
	createDB: function() {
		// Create database kind
		console.log("Creating db kind...");
		var indexes = [{"name":"actionsObjects", props:[{"name": "name", "tokenize":"all", "collate":"primary"}, {"name": "type"}, {"name": "objects"}]}];
		this.$.dbCreate.call({owner: enyo.fetchAppId(), indexes:indexes, sync:true});
	
	},
	
	createDBsuccess: function(inSender, inResponse) {
		//attempt to give db permissions to the launcher so user's can perform queries on our data with the Just Type feature
		//We do this after the db has been installed since otherwise we'd have nothing to grant permissions for.
		var permObj = [{"type":"db.kind","object":'eu.medesimo.quickactions:1',"caller":"com.palm.launcher","operations":{"read":"allow"}}];
		this.$.putDBPermissions.call({"permissions":permObj});
	},

	dbFail: function(inSender, inResponse) {
		console.log("dbService failure: " + enyo.json.stringify(inResponse));
	},
	
	actionQueryFail: function() {
		console.error("Failed to get action.");
	},

	deletedResponse: function(inSender, inResponse, inRequest) {
		this.$.QuickList.$.actionList.punt();
	},

	addedResponse: function(inSender, inResponse, inRequest) {
		//var items = this.$.CodiceListPane.totalItems;
		//this.$.CodiceListPane.setTotalItems(0); //clear it
		//console.log(items);
		
		this.$.QuickList.$.actionList.punt();	
		
		// show the newly added item
		this.$.dbGet.call({ids:[inResponse.results[0]["id"]]}, {onSuccess: "showActionFromResponse"});
		
		// scroll the list to bottom
		//this.$.CodiceListPane.$.codiciList.$.scroller.$.scroll.setScrollPosition(this.$.CodiceListPane.$.codiciList.$.scroller.bottom);
		/*for (var i=0; idx > this.$.CodiceListPane.$.codiciList.$.scroller.bottom && i<10;i++) {
			this.$.CodiceListPane.$.codiciList.$.scroller.$.scroll.setScrollPosition(this.$.CodiceListPane.$.codiciList.$.scroller.$.scroll.y + this.$.CodiceListPane.$.codiciList.$.scroller.contentHeight);
			sthis.$.CodiceListPane.$.codiciList.$.scroller.scroll();
		} */
		//this.$.CodiceListPane.scrollTo(this.$.CodiceListPane.recordList.length-1);
		//this.$.CodiceListPane.scrollTo(this.recordNumbers-1);
	},
	
	showActionFromResponse: function(inSender, inResponse, inRequest) {
		// shows action after addedResponse got the object of the newly added item
		this.showAction(null, null, null, inResponse.results[0]);
	},
	/* End database-related functions */
	
	
	
	
	/* String-related functions */
	capitalize: function(string) {
		// capitalizes a string. (taken from http://stackoverflow.com/questions/2332811/capitalize-words-in-string/7592235#7592235)
		return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	},
	
	parseString: function(string) {
		// Returns a base string with only letters (and no accents).
		
		if (!string) {
			return "";
		}
		
		string = enyo.g11n.Char.getBaseString(string);
		lettere_split = string.split("");
		new_string = new Array();
		
		for (lettera in lettere_split) {
			if (["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","w","z"," ","'"].indexOf(lettere_split[lettera].toLowerCase()) >= 0) {
				new_string.push(lettere_split[lettera]);
			}
		}
		
		return new_string.join("");
	},
	/* End string-related functions */




	/* UI (User Interface): Popups, helper functions, etc. */
	openAboutPopup: function(inSender, inEvent) {
		this.$.AboutPopup.openAtCenter();
	},
	
	openHelpPopup: function(inSender, inEvent) {
		this.$.HelpPopup.openAtCenter();
	},
	
	closeHelp: function(inSender, inEvent) {
		this.$.HelpPopup.close();
	},

	getActions: function() {
		var processed = []
		for (action in actions) {
			processed.push(action)
		}
		
		this.$.QuickShow.$.actionPicker.setItems(processed);
	},
	
	actionSet: function(act, obj) {
		if (act != "") {
			// Set action
			this.setCurrentAction(actions[act]);
			
			this.createActionComponents();
			
			// Set the row group caption
			this.$.QuickShow.$.row_type.setCaption(act);
			
			if (obj) {
				this.currentAction["show"](this, obj);
			}
		}
	},

	createActionComponents: function() {
				
		// Destroy widgets (if any) on the type rowgroup
		this.$.QuickShow.$.row_type.destroyControls();
		
		// If action does not have container ([]), simply hide the row_type.
		if(this.currentAction["container"] == "") {
			this.$.QuickShow.$.row_type.hide();
		} else {		
			// Append action-related widgets to row_type
			this.$.QuickShow.$.row_type.createComponents(this.currentAction["container"], {owner: this.$.QuickShow});
			
			// Show row_type
			this.$.QuickShow.$.row_type.show();
			
			this.$.QuickShow.$.row_type.render();
		}
	},

	showAction: function(inSender, inEvent, inIndex, fetched) {
		if (!fetched) {
			// we should fetch it ourselves
			this.setCurrentRecord(this.$.QuickList.$.actionList.fetch(inIndex));
		} else {
			// use fetched
			this.setCurrentRecord(fetched)
		}
				
		if (this.currentRecord) {

			// Show the rows
			this.$.QuickShow.$.row_general.show();
			this.$.QuickShow.$.row_type.show();
			
			// Get and set action
			if (this.currentRecord.type != "") {
				this.actionSet(this.currentRecord.type, this.currentRecord.objects);
			} else {
				// Set empty action
				this.setCurrentAction("");
				// Hide row_type, action is not set.
				this.$.QuickShow.$.row_type.hide();
			}
			
			// Set the action on the actionPicker
			if(this.currentRecord.type) {
				this.$.QuickShow.$.actionPicker.setValue(this.currentRecord.type);
			} else {
				this.$.QuickShow.$.actionPicker.setValue("Web"); // Should not reach this
			}
			
			// Set the name
			this.$.QuickShow.$.actionName.setValue(this.currentRecord.name);
			
			// Ready to roll!
			this.$.mainSliding.selectView(this.$.QuickShow);
			this.$.QuickShow.$.selectedItemName.setContent(this.currentRecord.name);
		}
	},

	clipboardCopy: function(inSender) {
		if (this.currentCodice != "") {
			enyo.dom.setClipboard(this.currentCodice);
			PalmSystem.copiedToClipboard(); 
		}
	},
	/* End UI */




	/* Data changes in database (put, merge, delete) */
	deleteAction: function(inSender, inIndex) {
		item = this.$.QuickList.$.actionList.fetch(inIndex);
		
		if (item) {
			if (this.currentRecord && (this.currentRecord._id == item._id)) {
				//we dropped the current item, hide rows
				this.$.QuickShow.$.row_general.hide();
				this.$.QuickShow.$.row_type.hide();
				//blank header on show
				this.$.QuickShow.$.selectedItemName.setContent("");
			}
			
			this.$.dbDel.call({ids: [item._id]});
		}
	},
	

	addNewAction: function(inSender, inSomething) {
		var newAction = {
			_kind: "eu.medesimo.quickactions:1",
			name: "",
			type: "Web", // FIXME: Defaulting web for now
			objects: {}
		};
		
		this.$.dbPut.call({objects: [newAction]});
		
	},

	doSave: function(inSender, inIndex) {
		if (this.currentRecord) {
			
			if (this.currentAction != "") {
				// we need to get a JSON object of the action things to save
				obj = this.currentAction["save"](this);
			} else {
				obj = {}
			}
			
			// action
			action = this.$.QuickShow.$.actionPicker.getValue();
			
			// name
			name = this.$.QuickShow.$.actionName.getValue().toLowerCase().replace(" ","");
		
			// update database
			this.$.dbMerge.call({objects: [{
				_id: this.currentRecord._id,
				name: name,
				type: action,
				objects: obj
			}]});
		
			}

			this.$.QuickList.$.actionList.punt();
	},
	/* End data changes-relevant functions */

});
