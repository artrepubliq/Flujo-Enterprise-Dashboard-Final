import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']
})
export class ThemeConfigComponent implements OnInit {
  titlecolor= '#548eee';
  PrimaryMenuTitleColor= '#534eae';
  ChildMenuTitleColor= '#aed342';
  PrimaryMenuOverColor= '#dea566';
  ChildMenuOverColor= '#ccc765';
  constructor() {
  }

  ngOnInit() {
  }

}
