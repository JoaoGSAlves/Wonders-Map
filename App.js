import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, PermissionsAndroid } from 'react-native';
import { Text, Button } from 'react-native-elements';
import locations from './locations';
import Geolocation from 'react-native-geolocation-service';

export default function App() {
	const [region, setRegion] = useState({
		latitude: 0,
		longitude: 0,
		latitudeDelta: 15,
		longitudeDelta: 15,
	});

	const [userLocation, setUserLocation] = useState(null);

	useEffect(() => {
		requestLocationPermission();
	}, []);

	async function requestLocationPermission() {
		try {
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				Geolocation.getCurrentPosition(
					(pos) => {
						const { latitude, longitude } = pos.coords;
						setRegion({ ...region, latitude, longitude });
						setUserLocation({ latitude, longitude });
					},
					(error) => console.error(error),
					{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
				);
			} else {
				console.log('Location not avaiable.');
			}
		} catch (error) {
			console.warn(error);
		}
	}

	const moveLocation = (coords) => {
		setRegion({ ...region, ...coords });
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				<Text style={styles.titleText}>World Locations</Text>
			</Text>
			<ButtonGroup buttons={locations} moveLocation={moveLocation} />

			<View style={styles.separator}></View>

			<MapView style={styles.map} region={region}>
				{locations.map((location, index) => (
					<Marker key={index} coordinate={location.coordinates} title={location.name} />
				))}
				{userLocation && <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />}
			</MapView>
		</View>
	);
}

function ButtonGroup({ buttons, moveLocation }) {
	return (
		<View style={styles.buttonGroup}>
			<View style={styles.columnContainer}>
				{buttons.slice(0, 3).map((location, index) => (
					<Button
						key={index}
						title={`${location.name} -> ${location.flag}`}
						onPress={() => moveLocation(location.coordinates)}
						buttonStyle={styles.button}
					/>
				))}
			</View>

			<View style={styles.columnContainer}>
				{buttons.slice(3, 6).map((location, index) => (
					<Button
						key={index}
						title={`${location.name} -> ${location.flag}`}
						onPress={() => moveLocation(location.coordinates)}
						buttonStyle={styles.button}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: 'black',
		marginTop: 30,
	},

	title: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 10,
	},

	titleText: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#FDB827',
	},

	separator: {
		borderTopColor: 'white',
		borderWidth: 1,
		marginTop: 20,
	},

	map: {
		flex: 1,
	},

	buttonGroup: {
		flex: 0.5,
		alignItems: 'center',
		flexDirection: 'row',
	},

	columnContainer: {
		flex: 1,
	},

	button: {
		margin: 5,
		backgroundColor: '#FDB827',
		borderWidth: 2,
		borderColor: '#0F0F0F',
		borderRadius: 9,
	},  
});
