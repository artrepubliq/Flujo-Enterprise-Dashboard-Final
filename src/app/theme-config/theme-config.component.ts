import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent implements OnInit {

  titleColor= '#548eee';
  PrimaryMenuTitleColor='#534eae';
  ChildMenuTitleColor='#aed342';
  PrimaryMenuOverColor='#dea566';
  ChildMenuOverColor='#ccc765';

  TitleFontFamily:any = [
    {id: 1, name: 'Roboto'},
    {id: 2, name: 'Lato'},
    {id: 3, name: 'Raleway'},
    {id: 4, name: 'Roboto Slab'},
    {id: 5, name: 'Montserrat'},
    {id: 6, name: 'Merriweather'}
  ];

  selectedFont: any;
  fontSize:number = 12;
  min: number = 8;
  max: number = 30;
  log = '';
  onOptionSelected(event){
    console.log(event); //option value will be sent as event
   }
  constructor() { 
    
  }

  // logDropdown(id: number): void {
  //   const NAME = this.TitleFontFamily.find((item: any) => item.id === +id).name;
  // }

  ngOnInit() {
  }

}
