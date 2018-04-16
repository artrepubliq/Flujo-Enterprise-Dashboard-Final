import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { EditorSelect } from '../model/editorselect.model';
@Injectable()
export class EditorSelectionService {

  public subject = new Subject<EditorSelect>();
  public editorType: EditorSelect;
  constructor() {
    this.editorType = {
      editorWeb: false,
      editorApp: false
    };
  }
  public onClick(editor_type, isActive) {
    this.editorType[editor_type] = isActive;
    // console.log(this.editorType);
    this.subject.next(this.editorType);
  }

  public getEditorData(): Observable<EditorSelect> {
    return this.subject.asObservable();
  }
}
