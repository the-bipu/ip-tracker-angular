import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  private map: any;
  public data: any;
  title: any;

  constructor(private http: HttpClient) {}

  private async initMap(): Promise<void> {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet');

      const key = environment.mapTilerKey;
      this.map = L.map('map').setView([30.196500, 75.684500], 14);

      L.tileLayer(
        `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
        {
          tileSize: 512,
          zoomOffset: -1,
          minZoom: 1,
          attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
          crossOrigin: true,
        }
      ).addTo(this.map);
    }
  }

  ngOnInit(): void {
    this.fetchDetails();
  }

  public fetchDetails() {
    this.http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe((response: any) => {
        console.log(response);
        this.data = response;
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
