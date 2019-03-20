/*
 * © 2019 SlashWebDesign
 */

import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from './components/sidebar';
import Page from './components/page';
import {User} from './user';
import {h, lg, xhr, config} from './helper';

class App extends React.Component {
	constructor(props){
		super(props);
	  
		this.state = {
			auth: User.token,
			settings: false
		};
		
		h.on('authStateChanged', function(){
			this.setState({auth: User.token});
		}.bind(this));
		
		xhr({
			path: 'settings/get',
			data: {
				fields: 'name, value',
				filter: '1=1'
			},
			success: function(res){
				h.parseSettings(res.data);
				this.setState({settings: true});
			}.bind(this)
		});
	};
	
	render(){
		if (this.state.auth && this.state.settings)
		{
			return(
				<div className="app">
					<SideBar />
					<Page params={this.state.params} />
				</div>
			);
		}
		else
		{
			return <Login />;
		}
	};
};

class Login extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			error: '',
			username: null,
			password: null
		};
		
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.signIn = this.signIn.bind(this);
		
		window.setTimeout(function(){
			var form = document.querySelector('.form');
			if (form) form.className = 'form visible';
		}, 200);
	};
	
	updateUsername(e){
		this.setState({username: e.target.value});
	};
	
	updatePassword(e){
		this.setState({password: e.target.value});
	};
	
	signIn(e){
		this.setState({error: ''});
		
		if ((e.type === 'keypress') && (e.which !== 13)) return false;
		
		if (!this.state.username)
		{
			this.setState({error: 'Please provide a username'});
			return false;
		}
		
		if (!this.state.password)
		{
			this.setState({error: 'Please provide a password'});
			return false;
		}
		
		User
			.auth(this.state.username, this.state.password)
			.then(function(){
				h.emit('authStateChanged');
			}.bind(this))
			.catch(function(error){
				this.setState({error: error});
			}.bind(this));
	};
	
	render(){
		return(
			<div className="login">
				<div className="form">
					<p className="error">{this.state.error}</p>
					<p><span className="ico ico-email"></span><input type="text" placeholder="Username" onChange={this.updateUsername} onKeyPress={this.signIn} /></p>
					<p><span className="ico ico-lock"></span><input type="password" placeholder="Password" onChange={this.updatePassword} onKeyPress={this.signIn} /></p>
					<p><button className="btn btn-primary" onClick={this.signIn}>Sign in</button></p>
				</div>
			</div>
		);
	};
};

ReactDOM.render(<App page="all"/>, document.querySelector('#root'));