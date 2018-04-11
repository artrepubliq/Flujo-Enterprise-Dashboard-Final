import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EditorSelectionService } from '../service/editor-selection.service';
@Component({
  selector: 'app-chooseplatform',
  templateUrl: './chooseplatform.component.html',
  styleUrls: ['./chooseplatform.component.scss']
})
export class ChooseplatformComponent implements OnInit {

  constructor(
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    public editorSelect: EditorSelectionService
  ) { }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  routing(editorType) {
    this.editorSelect.onClick(editorType, true);
    console.log(editorType);
    localStorage.setItem('editor_source', editorType);
    this.router.navigate(['admin/pages']);
  }
}
