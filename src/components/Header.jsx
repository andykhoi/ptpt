import React from 'react';
import { Link } from 'react-router-dom';

import { SideNav } from './SideNav';
import { HeaderOptions } from './HeaderOptions';

import { MapConsumer } from 'contexts/MapState';

export const SearchBar = () => (
	// MapConsumer here?
	<>
		<div className="SearchBar">
			<input placeholder="Enter a location or address" />
		</div>
	</>
);

export const Title = () => (
	<>
		<div className="Title">
			<img className="narrow-logo" src="../assets/narrow_logo.svg" alt="Logo - Prairie and Tree Planting Tool" />
			<img className="wide-logo" src="../assets/wide_logo.svg" alt="Logo - Prairie and Tree Planting Tool" />
		</div>
	</>
);

export const SaveButton = ({ save }) => (
	<>
		<div className="SaveButton">
			<img className="narrow-save" src="../assets/save_narrow.svg" onClick={save} alt="Save" />
			<img className="wide-save" src="../assets/save_wide.svg" onClick={save} alt="Save" />
		</div>
	</>
);

export class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<>
				<div className="Header">
					<div className="grid-row sidenav-btn">
						<SideNav />
						<Title />
						<SearchBar />
						<HeaderOptions />
						<MapConsumer>
							{ctx => <SaveButton save={ctx.save} />}
							
						</MapConsumer>
						
					</div>
					<div className="search-save-btn">
						<SearchBar />
						<SaveButton />
					</div>
				</div>
			</>
		);
	}
}
