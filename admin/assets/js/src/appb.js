/*
 * © 2019 SlashWebDesign
 */

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
	
class DropDown extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			selected: this.props.selected,
			display: this.props.display
		};
		this.triggerVisibility = this.triggerVisibility.bind(this);
		this.triggerChange = this.triggerChange.bind(this);
	};
	
	triggerVisibility(){
		this.setState({display: (this.state.display === 'closed') ? 'open' : 'closed'});
	};
	
	triggerChange(e){
		var item = $(e.target);
		
		this.props.onChange({value: item.data('key')});
		this.setState({display: 'closed', selected: item.text()});
	};
	
	buildList(){
		var 
			item = null,
			out = [];
		
		for (var i = 0; i < this.props.list.length; i++)
		{
			item = this.props.list[i];
			out.push(<li key={item.key} data-key={item.key}>{item.label}</li>);
		}
		
		return out;
	};
	
	render(){
		return(
			<div className={this.props.cls + ' dd'} data-state={this.state.display}>
				<div className="label" onClick={this.triggerVisibility}>{this.props.text} {this.state.selected}<span className="ico ico-keyboard-arrow-down"></span></div>
				<ul onClick={this.triggerChange}>
					{this.buildList()}
				</ul>
			</div>
		);
	};
};
	
class ListTools extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			order: this.props.order,
			search: this.props.search,
			sort: this.props.sort,
			cache: true
		};
		
		this.onChange = this.onChange.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		this.changeOrder = this.changeOrder.bind(this);
		this.forceRefresh = this.forceRefresh.bind(this);
	};
	
	changeSearch(e){
		this.setState({search: e.target.value.toLowerCase()}, this.onChange);
	};
	
	changeOrder(e){
		this.setState({order: $(e.target).hasClass('ico-keyboard-arrow-up') ? 'asc' : 'desc'}, this.onChange);
	};
	
	onChange(options){
		var temp = options ? {sort: options.value} : {};
		
		this.setState(temp, function(){
			this.props.onChange(this.state);
			this.setState({cache: true});
		}.bind(this));
	};
	
	forceRefresh(){
		this.setState({cache: false}, this.onChange);
	};
	
	render(){
		var dd = [{key: 'created', label: 'Date'}, {key: 'name', label: 'Name'}, {key: 'approved_status', label: 'Status'}];
	
		return (
			<div className="tools">
				<div className="total"><span className="ico ico-loop" onClick={this.forceRefresh}></span>{this.props.total} found</div>
				<div className="right">
					<DropDown list={dd} text="Sort by" cls="sort" display="closed" selected={this.state.sort} onChange={this.onChange} />
					<div className="order">
						Order
						<span className="ico ico-keyboard-arrow-up" onClick={this.changeOrder}></span>
						<span className="ico ico-keyboard-arrow-down" onClick={this.changeOrder}></span>
					</div>
					<div className="filter">
						<input type="text" onChange={this.changeSearch} placeholder="Filter results" />
					</div>
				</div>
			</div>
		);
	};
};

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
				<div className="profile">ICEBRKR</div>
				<h1>admin@icebr.kr</h1>
				<ul onClick={this.trigger}>
					<li data-page="home"><span className="ico ico-home"></span>Home</li>
					<li data-page="all"><span className="ico ico-list"></span>All users</li>
					<li data-page="" data-state={state}>
						<span className="ico ico-rate-review"></span>User that need action
						<ul className="sub">
							<li data-page="pending"><span className="ico ico-rate-review"></span>Pending</li>
							<li data-page="rejected"><span className="ico ico-rate-review"></span>Rejected</li>
						</ul>
					</li>
					<li data-page="approved"><span className="ico ico-check"></span>Approved users</li>
					<li data-page="settings"><span className="ico ico-settings"></span>Settings</li>
					<li data-page="signout"><span className="ico ico-exit-to-app"></span>Log out</li>
				</ul>
		    </div>
		);
	};
};

class Row extends React.Component {
	constructor(props){
		super(props);
		
		this.trigger = this.trigger.bind(this);
	};
	
	trigger(){
		h.emit('loadPage', 'detail', {key: this.props.id});
	};
	
	render(){
		var props = Object.assign({}, this.props);
		
		switch (props.status)
		{
			case 1: props.status = 'pending'; break;
			case 2: props.status = 'approved'; break;
			case 3: props.status = 'rejected'; break;
		}
		
		return (
			<div className="row">
				<div><span key={props.id} onClick={this.trigger}>{props.name}</span></div>
				<div>{props.status}</div>
				<div>{props.date}</div>
				<div>{props.notes}</div>
			</div>
		);
	};
};

class Card extends React.Component {
	constructor(props){
		super(props);
		
		this.trigger = this.trigger.bind(this);
	};
	
	trigger(){		
		h.emit('loadPage', this.props.page);
	};
	
	render(){
		return(
			<div className="card">
				<h3>{this.props.header}</h3>
				<button onClick={this.trigger}>{this.props.label}</button>
			</div>
		);
	}
};

class Home extends React.Component {
	constructor(props){
		super(props);
	  
		this.state = {
			pending: 0,
			rejected: 0,
			total: 0
		};
	};
	
	componentDidMount(){
		Ice.query('users/').then(function(res){
			var p = 0, r = 0;
			
			for (var i = 0; i < res.length; i++)
			{
				switch (res[i].approved_status)
				{
					case 1: p++; break;
					case 3: r++; break;
				}
			}
			
			this.setState({
				pending: p,
				rejected: r,
				total: res.length
			});
		}.bind(this));
	};
	
	render(){
		return (
			<div className="home">
				<h2><span className="ico ico-more-vert"></span>Home</h2>
				<div className="cards">
					<div />
					<Card header={"You have " + this.state.pending + " have pending users"} label="View pending users" page="pending" />
					<div />					
					<Card header={"You have " + this.state.rejected + " have rejected users"} label="View rejected users" page="rejected" />
					<div />
					<div />
					<Card header={"You have " + this.state.total + " have total users"} label="View all users" page="all" />
					<div />
				</div>
			</div>
		);
	};
};

class Detail extends React.Component {
	constructor(props){
		super(props);

		this.triggerHeaderIcon = this.triggerHeaderIcon.bind(this);
		this.triggerBack = this.triggerBack.bind(this);
		this.triggerDD = this.triggerDD.bind(this);
		this.triggerMessage = this.triggerMessage.bind(this);
		this.triggerSubmit = this.triggerSubmit.bind(this);
		
		this.closeLightbox = this.closeLightbox.bind(this); 
		this.openLightbox = this.openLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);

		this.statuses = {1: 'pending', 2: 'approved', 3: 'rejected'},
		this.user = Ice.getUser(this.props.params.key);
		
		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
			history: [],
			status: this.user.approved_status,
			message: ''
		};
		this.fetchHistory();
	};
	
	fetchHistory(){
		Ice.query('users_history/' + this.props.params.key + '/', {sort: 'date', order: 'desc'})
			.then(function(r){
				this.setState({history: r});
			}.bind(this))
			.catch(function(e){
				lg(e);
			});
	};
	
	getQA(o){
		var q = null;
		
		for (var key in o)
		{
			if (key !== 'answer') q = key;
		}
		
		return {
			question: o[q],
			answer: o.answer
		};
	};
	
	openLightbox(event){
		this.setState({
			currentImage: parseInt(event.target.dataset.index, 10),
			lightboxIsOpen: true
		});  
	};

	closeLightbox(){
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false
		}); 
	};
	
	gotoPrevious() {
		this.setState({
			currentImage: this.state.currentImage - 1
		});  
	};
	
	gotoNext(){
		this.setState({
			currentImage: this.state.currentImage + 1
		}); 
	};
	
	renderImages(){
		if (!this.user.images) return;

		var 
			out = [],
			i = 5,
			img = this.user.images.core_photo,
			extra = this.user.images.extra_photo ? this.user.images.extra_photo : {};
			
		out.push(
			<div key="head"><img data-index={1} src={img.headshot_url} /><p>Headshot</p></div>,
			<div key="full"><img data-index={0} src={img.full_length_url} /><p>Full-length</p></div>,
			<div key="personality"><img data-index={2} src={img.personality_url} /><p>Personality</p></div>,
			<div key="story"><img data-index={3} src={img.storytelling_url} /><p>Storytelling</p></div>
		);

		for (var key in extra)
		{
			out.push(<div key={key}><img data-index={1} src={extra[key]} /><p>{i}</p></div>);
			i++;
		}
		 return out;
	};
	
	renderBio(){
		if (!this.user.bio) return;
		
		var out = [];

		for (var key in this.user.bio.me)
		{
			var qa = this.getQA(this.user.bio.me[key]);
			
			out.push(
				<div key={'me-' + key} className="bio">
					<p>{qa.question}</p>
					<p className="answer">{qa.answer}</p>
				</div>
			);
		}

		for (var key in this.user.bio.partner)
		{
			var qa = this.getQA(this.user.bio.partner[key]);
			
			out.push(
				<div key={'partner-' + key} className="bio">
					<p>{qa.question}</p>
					<p className="answer">{qa.answer}</p>
				</div>
			);
		}
		
		return out;
	};
	
	renderHistory(){
		var out = [];
		
		for (var i = 0; i < this.state.history.length; i++)
		{
			out.push(
				<div key={i} className="row">
					<div>{moment(this.state.history[i].date).format('MMMM DD YYYY')}</div>
					<div>{this.statuses[this.state.history[i].status]}</div>
					<div>{this.state.history[i].note}</div>
				</div>
			);
		}
		
		return out;
	};
	
	triggerHeaderIcon(){
		h.emit('headerIcon');
	};
	
	triggerMessage(e){
		this.setState({message: e.target.value});
	};
	
	triggerDD(selection){
		this.setState({status: selection.value});
	};
	
	triggerSubmit(){
		lg('icebrkr > update user status to [' + this.state.status + ']');
		Ice.set('users/' + this.props.params.key + '/approved_status', this.state.status);
		Ice.set('users/' + this.props.params.key + '/status_message', this.state.message);
		
		lg('icebrkr > create entry point in user history');
		var entry = Ice.push('users_history/' + this.props.params.key + '/');
		
		Ice
			.set('users_history/' + this.props.params.key + '/' + entry.key, {
				date: moment().valueOf(),
				id: entry.key,
				note: this.state.message,
				status: this.state.status
			});
		
		lg('icebrkr > send push notification [' + this.state.message + ']');
		
		lg('icebrkr > force user data update to refresh the cache');
		Ice.query('users/', {cache: false});
		
		this.fetchHistory();
		toast("User status updated", {type: 'success'});
	};
	
	triggerBack(){
		h.emit('loadPage', this.props.params.back);
	};
	
	render(){
		var 
			pages = {
				all: 'All users',
				pending: 'Pending users',
				rejected: 'Rejected users',
				approved: 'Approved users'
			},
			dd = [{key: 1, label: 'pending'}, {key: 2, label: 'approved'}, {key: 3, label: 'rejected'}];
		
		return (
			<div className="detail">
				<h2><span className="ico ico-more-vert" onClick={this.props.triggerHeaderIcon}></span><span className="back" onClick={this.triggerBack}>{pages[this.props.params.back]}</span> / {this.user.name}</h2>
				<div className="container">
					<div className="images">
						<h3>Photos</h3>
						{this.renderImages()}
					</div>
					<div className="data">
						<h3>Details</h3>
						<div className="action">
							<div className="table">
								<div className="row">
									<div className="label">Firebase ID</div>
									<div className="value">{this.user.id}</div>
								</div>
								<div className="row">
									<div className="label">Name</div>
									<div className="value">{this.user.name}</div>
								</div>
								<div className="row">
									<div className="label">Age</div>
									<div className="value">{this.user.age ? this.user.age : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Date of birth</div>
									<div className="value">{this.user.birthday ? this.user.birthday : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Gender</div>
									<div className="value">{this.user.gender ? this.user.gender : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Education</div>
									<div className="value">{this.user.basic ? this.user.basic.education_lavel.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Occupation</div>
									<div className="value">{this.user.basic ? this.user.basic.occupation.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Height</div>
									<div className="value">{this.user.basic ? this.user.basic.height.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Ethnicity</div>
									<div className="value">{this.user.basic ? this.user.basic.ethinicity.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">School</div>
									<div className="value">{this.user.basic ? this.user.basic.school.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Location</div>
									<div className="value">{this.user.basic ? this.user.basic.location.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Sexual preference</div>
									<div className="value">{this.user.preferences ? this.user.preferences.interest_in : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Maximum distance</div>
									<div className="value">{this.user.preferences ? this.user.preferences.distance : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Age range min</div>
									<div className="value">{this.user.preferences ? this.user.preferences.age_range_min : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Age range max</div>
									<div className="value">{this.user.preferences ? this.user.preferences.age_range_max : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Previous relationships</div>
									<div className="value">{this.user['2nd_level'] ? this.user['2nd_level'].relationship.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Income</div>
									<div className="value">{this.user['2nd_level'] ? this.user['2nd_level'].income.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Politics</div>
									<div className="value">{this.user['2nd_level'] ? this.user['2nd_level'].politics.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Religion</div>
									<div className="value">{this.user['2nd_level'] ? this.user['2nd_level'].religion.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Drink</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.drink.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Exercise</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.exercise.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Have kids</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.have_kids.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Want kids</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.want_kids.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Smoke</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.smoke.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Marijuana</div>
									<div className="value">{this.user.lifestyle ? this.user.lifestyle.marijuana.value : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">ZIP code</div>
									<div className="value">{this.user.zip_info ? this.user.zip_info.zipcode : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Latitude</div>
									<div className="value">{this.user.zip_info ? this.user.zip_info.lat : 'N/A'}</div>
								</div>
								<div className="row">
									<div className="label">Longitude</div>
									<div className="value">{this.user.zip_info ? this.user.zip_info.lng : 'N/A'}</div>
								</div>
							</div>
							<div className="status">
								<DropDown list={dd} text="Status" cls="" display="closed" selected={this.statuses[this.user.approved_status]} onChange={this.triggerDD} />
								<textarea placeholder="Message" onChange={this.triggerMessage}></textarea>
								<button onClick={this.triggerSubmit}>Submit</button>
							</div>
						</div>
						
						<h3>Bio questions</h3>
						{this.renderBio()}
								
						<h3>History</h3>
						<div className="history">
							<div className="header">
								<div>Date</div>
								<div>Status</div>
								<div>Message</div>
							</div>
							{this.renderHistory()}
						</div>
					</div>
				</div>
			</div>
		);
	};
};

class List extends React.Component {
	constructor(props){
		super(props);
	  
		this.state = {
			users: {},
			params: {
				sort: 'name',
				order: 'asc',
				search: '',
				filter: null,
				cache: true
			}
		};
		this.refresh = this.refresh.bind(this);
		this.triggerHeaderIcon = this.triggerHeaderIcon.bind(this);
	};
	
	componentDidMount(){
		Ice.query('users/', Object.assign({}, this.state.params, {filter: this.props.filter}))
			.then(function(r){
				this.setState({users: r});
			}.bind(this))
			.catch(function(e){
				lg(e);
			});
	};
	
	triggerHeaderIcon(){
		h.emit('headerIcon');
	};
	
	refresh(options){
		this.setState({params: options}, this.componentDidMount);
	};
	
	renderRow(){
		var 
			user = null,
			rows = [];
		
		for (var i = 0; i < this.state.users.length; i++)
		{
			user = this.state.users[i];
			
			if (user.id)
			{
				rows.push(<Row key={user.key} id={user.key} name={user.name} status={user.approved_status} date={moment(user.created).format('MMMM DD, YYYY')} notes={user.status_message} />);
			}
		}
		
		return rows;
	};
	
	renderTable(){
		return (
			<div className="grid">
				<ListTools sort="name" total={this.state.users.length} order="asc" search="" onChange={this.refresh} cache="true" />
				<div className="header">
					<div>Name</div>
					<div>Status</div>
					<div>Date</div>
					<div>Notes</div>
				</div>
				{this.renderRow()}
			</div>
		);
	};
	
	render(){
		return (
			<div className="list">
				<h2><span className="ico ico-more-vert" onClick={this.triggerHeaderIcon}></span>{this.props.header}</h2>
				{this.renderTable()}
			</div>
		);
	};
};

class Content extends React.Component {
	renderPage(){
		var status = {
			pending: {approved_status: 1},
			approved: {approved_status: 2},
			rejected: {approved_status: 3}
		};
		
		switch (this.props.page)
		{
			case 'home': return <Home />; break;
			case 'all': return <List key="all" filter={null} header="All users" />; break;
			case 'pending': return <List key="pending" filter={status[this.props.page]} header="Pending users" />; break;
			case 'rejected': return <List key="rejected" filter={status[this.props.page]} header="Rejected users" />; break;
			case 'approved': return <List key="approved" filter={status[this.props.page]} header="Approved users" />; break;
			case 'detail': return <Detail params={this.props.params} />; break;
			case 'signout': 
				Ice.signOut();
				window.location.reload();
				break;
		}
	};
	
	render(){
		return (<div className="content">{this.renderPage()}</div>);
	};
};

class App extends React.Component {
	constructor(props){
		super(props);
	  
		this.state = {
			auth: Ice.currentAuth(),
			minimized: false,
			page: this.props.page,
			params: {}
		};
		this.changePage = this.changePage.bind(this);
		
		h.on('loadPage', this.changePage);
		
		h.on('headerIcon', function(){
			this.setState({minimized: !this.state.minimized});
		}.bind(this));
		
		h.on('authStateChanged', function(user){
			this.setState({auth: user});
		}.bind(this));
	};
	
	changePage(page, params){
		lg('app > switching to page [' + page + ']');
		
		this.setState({
			page: page,
			params: Object.assign({}, params, {back: this.state.page})
		});
	};
	
	render(){
		if (this.state.auth)
		{
			lg('app > rendering page [' + this.state.page + ']');

			return(
				<div className="app" data-minimized={this.state.minimized}>
					<SideBar />
					<Content page={this.state.page} params={this.state.params} />
					<ToastContainer hideProgressBar={true} />
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
			email: null,
			password: null
		};
		
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.signIn = this.signIn.bind(this);
		
		window.setTimeout(function(){
			document.querySelector('.form').className = 'form visible';
		}, 200);
	};
	
	updateEmail(e){
		this.setState({email: e.target.value});
	};
	
	updatePassword(e){
		this.setState({password: e.target.value});
	};
	
	signIn(e){
		this.setState({error: ''});
		
		if ((e.type === 'keypress') && (e.which !== 13)) return false;
		
		Ice
			.signIn(this.state.email, this.state.password)
			.catch(function(error){
				lg(error);
				this.setState({error: error.message});
			}.bind(this));
	};
	
	render(){
		return(
			<div className="login">
				<div className="form">
					<p className="error">{this.state.error}</p>
					<p><span className="ico ico-email"></span><input type="text" placeholder="Email address" onChange={this.updateEmail} onKeyPress={this.signIn} /></p>
					<p><span className="ico ico-lock"></span><input type="password" placeholder="Password" onChange={this.updatePassword} onKeyPress={this.signIn} /></p>
					<p><button onClick={this.signIn}>Sign in</button></p>
				</div>
			</div>
		);
	};
};

ReactDOM.render(<App page="all"/>, document.querySelector('#root'));