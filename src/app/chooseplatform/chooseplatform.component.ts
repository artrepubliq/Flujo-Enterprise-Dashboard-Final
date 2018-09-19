import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { EditorSelectionService } from '../service/editor-selection.service';
@Component({
  selector: 'app-chooseplatform',
  templateUrl: './chooseplatform.component.html',
  styleUrls: ['./chooseplatform.component.scss']
})
export class ChooseplatformComponent implements OnInit {
  public editorSelect: EditorSelectionService;
  feature_id: number;
  constructor(private router: Router, private httpClient: HttpClient) {
    this.feature_id = 1;
  }

  ngOnInit() {
    setTimeout(function() {
      // this.spinnerService.hide();
    }.bind(this), 3000);
  }

  routing (editorType) {
    // this.editorSelect.onClick(editorType, true);
    console.log(editorType);
    localStorage.setItem('editor_source', editorType);
    this.router.navigate(['admin/pages']);
  }
}
