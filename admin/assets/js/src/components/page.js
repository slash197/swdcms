/* 
 * Author Slash Web Design
 */

import React from 'react';

class Page extends React.Component {
	renderPage(){
	};
	
	render(){
		return (<div className="content">{this.renderPage()}</div>);
	};
};

export default Page;