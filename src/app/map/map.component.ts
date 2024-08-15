import { Component, AfterViewInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  map: any;
  lat: number = 0;
  lng: number = 0;
  data: any = [];
  ip: string = '';
  latString: string = '';
  lngString: string = '';

  constructor(private service: SharedService) { 
    //get all necessary data
    service.ip$.subscribe((ip: string) => {
      this.ip = ip;
    }, (err: any) => {
      console.error(err);
    });

    service.data$.subscribe((data: any) => {
      this.data = data.location;
      this.getValues();
    }, (err: any) => {
      console.error(err);
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.initMap();
    }
  }

  private async initMap(): Promise<void> {
    const L = (await import('leaflet')).default;
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  getValues(): void {
    this.latString = this.data ? this.data.lat : '';
    this.lngString = this.data ? this.data.lng : '';

    this.lat = this.latString !== '' ? parseFloat(this.latString) : 0;
    this.lng = this.lngString !== '' ? parseFloat(this.lngString) : 0;

    if (this.lat !== 0 || this.lng !== 0) {
      this.map.setView([this.lat, this.lng]);

      const marker = (window as any).L.marker([this.lat, this.lng]);
      marker.addTo(this.map);
      marker.bindPopup(this.ip === '' 
        ? "<b>Hey!!</b><br>This is your public IP." 
        : "<b>Hey!!</b><br>This IP is what you're looking for."
      ).openPopup();
    }
  }
}
