steal('documentjs/showdown.js','./helpers/typer.js',
	'./helpers/tree.js',
	'./helpers/namer.js',
	'./helpers/typeNameDescription.js',
	function(converter, typer, tree,namer, tnd) {

	var getOptions = function(param){
		for(var i =0; i < param.types.length; i++) {
			if( param.types[i].options ) {
				return param.types[i].options;
			}
		}
	}

	var getParams = function(param){
		for(var i =0; i < param.types.length; i++) {
			if( param.types[i].params ) {
				return param.types[i].params;
			}
		}
	}

	var getOrMakeOptionByName = function(options, name){
		for(var i =0; i < options.length; i++) {
			if( options[i].name === name ) {
				return options[i];
			}
		}
		var option = {name: name}
		options.push(option);
		return option;
	}
	

	/**
	 * @constructor documentjs/tags/option @option
	 * @tag documentation
	 * @parent DocumentJS 
	 * 
	 * Details the properties of an object or the arguments of a function
	 * in a [documentjs/tags/param @param] tag.
	 * 
	 * @signature `@option {TYPE} NAME DESCRIPTION`
	 * 
	 * @codestart
     * /**
     *  * Retrieves a list of orders.
     *  * 
     *  * @@param {{}} params A parameter object with the following options:
     *  * @@option {String} type Specifies the type of order.
     *  * @@option {Number} [createdAt] Retrieves all orders after this timestamp. 
     *  *
     *  * @@param {function(Orders.List)} [success(orders)] Filter order search by this date.
     *  * @@option orders A list of [Orders] that match `params`.
     *  *|
     *  find: function( params, success ) {
	 *  @codeend
	 * 
	 * 
	 * @param {documentjs/type} [TYPE] A type expression specified 
	 * [here](https://developers.google.com/closure/compiler/docs/js-for-compiler#types).
	 * 
	 * @param {documentjs/name} NAME The name of the option. It can be specified as:
	 * 
	 *  - A simple name:
	 * 
	 * @codestart
     * /**
     *  * @@param {TYPE} id 
     *  *|
	 * @codeend
	 * 
	 * 
	 * @body
	 * 
	 * 
	 * 
	 * ###Use cases:
	 * 
	 * 1. Common use:
	 * 
	 *      __@@params {TYPE} name description__
	 * 
	 * 2. Optional parameters use case:
	 * 
     *     __@@params {TYPE} [name] description__
     * 
     * 3. Default value use case:
     * 
     *     __@@params {TYPE} [name=default] description__
	 *
	 * ###Example:
	 * 
	 * @codestart
     * /*
     *  * Finds an order by id.
     *  * @@param {String} id Order identification number.
     *  * @@param {Date} [date] Filter order search by this date.
     *  *|
     *  findById: function(id, date) {
     *      // looks for an order by id
     *  }   
	 *  @codeend
	 *  
	 * 
	 */
	return {

		addMore: function( line, last ) {
			if ( last ) last.description += "\n" + line;
		},
		add: function( line ) {
			var prevParam = this._curParam || (this.params && this.params[this.params.length - 1]) || this;
			// start processing
			
			var data = tnd(line);
			if(!data.name){
				print("LINE: \n" + line + "\n does not match @params [{TYPE}] NAME DESCRIPTION");
			}
			
			if(!prevParam.types){
				prevParam.types = [];
			}
			var params = getParams(prevParam);
			var options = getOptions(prevParam);
			if(!options && !params){
				print("LINE: \n" + line + "\n could not find an object or arguments to add options to.");
				return;
			}
			var option = getOrMakeOptionByName(options || params, data.name);
			
			
			option.description = data.description;
			
			for(var prop in data){
				option[prop] =  data[prop];
			}

			return option;
		},
		done : function(){
			return;
			if(this.ret && this.ret.description && this.ret.description ){
				this.ret.description = converter.makeHtml(this.ret.description)
			}
			if(this.params){
				for(var paramName in this.params){
					if(this.params[paramName].description  ){
						this.params[paramName].description = converter.makeHtml(this.params[paramName].description)
					}
				}
			}
		}
	};

})