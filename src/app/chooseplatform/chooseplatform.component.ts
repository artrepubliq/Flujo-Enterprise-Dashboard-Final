import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-chooseplatform',
  templateUrl: './chooseplatform.component.html',
  styleUrls: ['./chooseplatform.component.scss']
})
export class ChooseplatformComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  routing () {
    this.router.navigate(['admin/pages']);
  }
}
