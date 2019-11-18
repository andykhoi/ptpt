import React from 'react';
import {
	Link,
	Redirect,
} from 'react-router-dom';
import tree from 'test_data/tree.json';
import Debug from 'debug';

const debug = Debug('MapComponent');

export class PlantTrees extends React.Component {
	events = new Map()

	componentDidMount() {
		this.setDrawMode();
	}

	componentDidUpdate() {
		const {
			events,
			props: {
				map,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map.off(key, value);
			events.delete(key);
		});

		this.setDrawMode();
	}

	setDrawMode() {
		const {
			router: {
				match: {
					params: {
						step,
					},
				},
			},
			setEditingFeature,
			nextStep,
			map,
			draw,
			editingFeature,
			type,
		} = this.props;

		if (!step) {
			// If not on a config step, that means we're drawing, so enter draw_polygon mode with a clean slate.
			debug('Entering draw_polygon mode.');

			draw.deleteAll();
			editingFeature && setEditingFeature(null);

			draw.changeMode('draw_polygon');

			// Setup a new draw.create listener.
			// This will update the feature with some default properties,
			// then move the router onto the next step and set the feature being edited.
			const onCreate = e => {
				map.off('draw.create', onCreate);
				const feature = e.features[0];
				feature.properties = {
					...feature.properties,
					type,
					configs: tree.properties.configs, // These are some default properties for testing.
				};
				draw.add(feature);
				debug('Created feature:', feature);
				nextStep('/plant/trees/rows');
				setEditingFeature(feature);
			};
			map.on('draw.create', onCreate);
			this.events.set('draw.create', onCreate);
		} else if (editingFeature) {
			// Else, if we're on a config step and there is a feature being edited, enter direct_select mode.
			// This actually doesn't matter too much because if we're on a config step the modal overlay blocks map interactivity.
			debug('Entering direct_select mode.', editingFeature);
			if (!draw.get(editingFeature.id)) {
				draw.add(editingFeature);
			}
			draw.changeMode('direct_select', { featureId: editingFeature.id });
		}
	}

	componentWillUnmount() {
		const {
			events,
			props: {
				setEditingFeature,
				map,
				draw,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map.off(key, value);
			events.delete(key);
		});

		// Clean up draw and feature state.
		draw.deleteAll();
		setEditingFeature(null);
	}

	render() {
		const {
			router: {
				match: {
					params: {
						step,
					},
				},
			},
			data,
			deleteFeature,
			editingFeature,
			saveFeature,
		} = this.props;

		if (!editingFeature) {
			// If there isn't a feature being edited, navigate to the draw step.
			return <Redirect to="/plant/trees" />;
		}

		const {
			properties: {
				configs,
			},
		} = editingFeature;

		// If we're on a config step, render the form.
		return step ? (
			<div className="PlantTrees MapModeForm vertical-align">
				{/* the modal below needs to be replaced with a prebuilt component */}
				<div className="modal margin-center">
					<div>
						<p>Some pre-filled properties for this {editingFeature.properties.type} polygon...</p>
						<p>Rows: {configs.rows.length}</p>
						{
							configs.rows.map((ea, i) => (
								<div key={`row-${i + 1}`} className="spacer-left-1">
									<p>Row {i + 1}</p>
									<div className="spacer-left-1">
										<p>Type: {ea.type.display}</p>
										<p>Species: {ea.species.display}</p>
									</div>
								</div>
							))
						}
						<p>Row Spacing: {configs.spacing_rows.value} {configs.spacing_rows.unit}</p>
						<p>Tree Spacing: {configs.spacing_trees.value} {configs.spacing_trees.unit}</p>
						<p>Drip Irrigation: {configs.drip_irrigation ? 'yes' : 'no'}</p>
						<div className="spacer-top-2 distribute">
							{
								data.get(editingFeature.id)
									? (
										<div>
											<span onClick={() => deleteFeature(editingFeature.id)} onKeyDown={e => e.keyCode === 13 && deleteFeature(editingFeature.id)} role="button" tabIndex="0">Delete</span>
										</div>
									)
									: (
										<div>
											<Link className="modal-link" to="/plant/trees">Start Over</Link>
										</div>
									)
							}
							<button onClick={saveFeature} className="Button" type="button">Done</button>
						</div>
					</div>
				</div>
			</div>
		) : null;
	}
}
