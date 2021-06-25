import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import GeoPointer from 'src/app/models/db/geopointer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'eu-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() positionLoaded;
  @Output() positionEvent = new EventEmitter();
  mainMarker: mapboxgl.Marker;
  map: mapboxgl.Map;
  position = new GeoPointer();

  constructor() {
    this.position.latitude = 0;
    this.position.longitude = 0;
  }

  async ngOnInit(): Promise<void> {
    this.position = this.positionLoaded ? this.positionLoaded : this.position;
    (mapboxgl as any).accessToken = environment.mapBoxKey;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.position.longitude, this.position.latitude],
      zoom: 9,
    });
    this.mainMarker = this.createMarker(
      this.position.longitude,
      this.position.latitude
    );
    // this.createGeolocateControl();
    this.getCurrentPosition();
  }

  async getCurrentPosition(): Promise<void> {
    if (!navigator.geolocation || this.positionLoaded) {
      console.error('location is not supported');
    } else {
      navigator.geolocation.getCurrentPosition(async (currentPosition) => {
        this.position.latitude = currentPosition.coords.latitude;
        this.position.longitude = currentPosition.coords.longitude;
        this.positionEvent.emit(this.position);
        const latLng = new mapboxgl.LngLat(
          this.position.longitude,
          this.position.latitude
        );
        this.map.setCenter(latLng);
        this.mainMarker.setLngLat(latLng);
      });
    }
  }

  createGeolocateControl(): void {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    this.map.addControl(geolocate);
  }

  createMarker(lng: number, lat: number): mapboxgl.Marker {
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);
    marker.on('drag', () => {
      this.position.latitude = marker.getLngLat().lat;
      this.position.longitude = marker.getLngLat().lng;
      this.positionEvent.emit(this.position);
    });
    return marker;
  }
}
