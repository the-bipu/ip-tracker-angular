import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IP-Address-Tracker';

  IP: string = "";

  ip: string = "";
  country: string = "";
  region: string = "";
  timeZone: string = "";
  postalCode: string = "";
  isp: string = "";

  alert: string = "Search for any IP address or domain";

  //regexp for IPv4 address
  reIp = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;
  //regexp for domain
  reDomain = /\w+\.[a-z]+/i;


  constructor(private service: SharedService) {
    service.void$.subscribe(() => {

      this.ip = "-1";
      this.country = "-1";
      this.region = "-1";
      this.timeZone = "-1";
      this.postalCode = "-1";
      this.isp = "-1";
    })

    service.data$.subscribe((data: any) => {

      this.ip = data.ip;
      this.region = data.location.region ? data.location.region + ", " : "";
      this.country = data.location.country === "ZZ" ? "n/a" : data.location.country;
      this.postalCode = data.location.postalCode ? ", " + data.location.postalCode : "";
      this.timeZone = data.location.timezone ? data.location.timezone : "n/a";
      this.isp = data.isp ? data.isp : "n/a";


    }, (err: any) => {
      console.error(err);
    });
  }


  ngOnInit(): void {
    this.search();
  }

  search(): void {

    if (this.reIp.test(this.IP) || this.IP === '') {//search for ip

      this.service.reinitData();
      this.service.getIPData(this.IP).subscribe((data: any) => {

        this.service.IP = this.IP;
        this.service.APIData = data;
        this.service.changeData();
      }, (err: any) => {
        console.error(err);
      });
    } else if (this.reDomain.test(this.IP.toLowerCase())) {//search for domain

      this.service.reinitData();
      this.service.getDomainData(this.IP.toLowerCase()).subscribe((data: any) => {


        this.service.IP = this.IP;
        this.service.APIData = data;
        this.service.changeData();


      }, (err: any) => {

        this.IP = "";
        this.service.changeData();
        this.alert = "Error 404 -Maybe this domain doesn't exist. Try another one";
        console.error(err);
      })

    } else {

      this.IP = "";
      this.alert = "ej:('8.8.8.8' or 'google.com')"
    }
  }

}
