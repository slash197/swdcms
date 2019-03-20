/*
 * © 2019 SlashWebDesign
 */

import {config} from './config';

var 
	EventEmitter = require('event-emitter'),

	HelperFunctions = function(){
		this.lg = function(o, level){
			if (!level) level = 'info';

			if (console)
			{
				switch (level)
				{
					case 'trace': console.log('%c' + o, 'color: #2f68b4'); break;
					case 'error': console.error(o); break;
					case 'warn': console.warn(o); break;
					case 'log':
					case 'info':
					default: console.log(o); break;
				}
			}
		};
		
		this.parseSettings = function(settings){
			for (var i = 0; i < settings.length; i++)
			{
				config.settings[settings[i].name] = settings[i].value;
			}
		};

		this.xhr = function(options){
			var settings = $.extend({
				path: '',
				data: {},
				dataType: 'json',
				success: function(){},
				error: function(){},
				complete: function(){}
			}, options);

			$.ajax({
				url: config.api.host + settings.path,
				data: settings.data,
				dataType: settings.dataType,
				type: settings.type,
				success: settings.success,
				error: settings.error,
				complete: settings.complete
			});
		};
	},
	h = new HelperFunctions(),
	lg = h.lg,
	storage = window.localStorage,
	xhr = h.xhr;

EventEmitter(HelperFunctions.prototype);

export {h};
export {lg};
export {storage};
export {xhr};
export {config};