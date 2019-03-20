/* 
 * Author Slash Web Design
 */

import React from 'react';
import {config} from '../helper';

class SideBar extends React.Component {
	constructor(props){
		super(props);
	  
		this.state = {
			display: 'closed',
			minimized: false
		};
		this.trigger = this.trigger.bind(this);
	};
	
	trigger(e){
		var 
			menu = $(e.target),
			hasState = typeof menu.data('state') !== 'undefined',
			page = menu.data('page');

		if (hasState) this.setState({display: (this.state.display === 'closed') ? 'open' : 'closed'});
		
		if (page) h.emit('loadPage', page);
	};
	
	render(){
		var state = this.state.display ? this.state.display === 'open' ? 'open' : 'closed' : 'closed';
		
		return (
			<div className="sidebar">
				<h1><span>{config.settings['site name']}</span>Control Panel</h1>
				<ul onClick={this.trigger}>
					<li data-page="home"><span className="ico ico-home"></span>Dashboard</li>
					<li data-page="settings"><span className="ico ico-folder-open"></span>Pages</li>
					<li data-page="signout"><span className="ico ico-menu"></span>Menu</li>
					<li data-page="all"><span className="ico ico-account-child"></span>Users</li>
					<li data-page="all"><span className="ico  ico-verified-user"></span>Administrators</li>
					<li data-page="all"><span className="ico ico-notifications-none"></span>Notifications</li>
					<li data-page="approved"><span className="ico ico-settings"></span>Settings</li>
					<li data-page="signout"><span className="ico ico-payment"></span>Transactions</li>
					<li data-page="" className="divider"></li>
					<li data-page="signout"><span className="ico ico-exit-to-app"></span>Sign out</li>
				</ul>
		    </div>
		);
	};
};

export default SideBar;