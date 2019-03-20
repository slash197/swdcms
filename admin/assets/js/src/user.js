/* 
 * Author Slash Web Design
 */
import {h, lg, xhr, storage} from './helper';

var 
	UserClass = function(){
		this.token = storage.getItem('swd.token') || null;

		this.auth = function(username, password){					
			return new Promise(function(resolve, reject){
				h.xhr({
					path: 'auth',
					data: {
						username: username,
						password: password,
						q: ''
					},
					success: function(result){
						if (result.status)
						{
							this.token = result.token;
							storage.setItem('swd.token', this.token);
							resolve();
						}
						else
						{
							reject(result.error);
						}
					}.bind(this),
					error: reject
				});
			}.bind(this));
		};
		
		lg('auth > token [' + this.token + ']');
	},
	User = new UserClass();

export {User};