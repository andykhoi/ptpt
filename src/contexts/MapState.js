import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import Debug from 'debug';

const debug = Debug('MapState');

export const MapDefaultState = {
	data: new Map(),
};
export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = (that) => ({
	addData(geojson) {
		const errors = geojsonhint.hint(geojson);
		if (!errors || errors.length === 0 || (errors.length === 1 && errors[0].message.includes('right-hand rule'))) {
			if (geojson.type === 'FeatureCollection') {
				geojson.features.forEach(ea => this.addData(ea));
			} else {
				// Create new map depending on if the new geojson should go into staticData or gl-draw data.
				const data = new Map(that.state.MapState.data);
				data.set(geojson.properties.id, geojson);

				// Rebuild a new state object with new mapData. mapData should be updated into correct data (static or nonstatic).
				const updateState = {
					MapState: {
						...that.state.MapState,
						data,
					},
				};

				// Update state.
				that.setState(updateState);
			}
		} else {
			debug('Error adding data to context:', errors);
		}
	},
});
