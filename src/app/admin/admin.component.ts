import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  public nickName: string;

  constructor(public authService: AuthService, private mScrollbarService: MalihuScrollbarService) { }
  ngOnInit(): void {
    this.nickName = localStorage.getItem("nickname");
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
  }
  viewPages() {
    localStorage.setItem("page_item", "viewpages");
  }
  addPages() {
    localStorage.setItem("page_item", "addpages");
  }

}