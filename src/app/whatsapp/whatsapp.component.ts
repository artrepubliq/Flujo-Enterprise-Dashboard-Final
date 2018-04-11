import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {

  dropDownData: Object;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDropDownList();
  }

  getDropDownList() {
    this.http.get('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_getsmstemplateconfig/1232')
    .subscribe(
      res => {
        console.log(res);
        this.dropDownData = res;
      },
      error => {
        console.log(error);
      }
    );
  }
}
