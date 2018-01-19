import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  public nickName: string;

  constructor(public authService: AuthService) { }
  ngOnInit(): void {
    this.nickName = localStorage.getItem("nickname");
  }
  viewPages() {
    localStorage.setItem("page_item", "viewpages");
  }
  addPages() {
    localStorage.setItem("page_item", "addpages");
  }

}