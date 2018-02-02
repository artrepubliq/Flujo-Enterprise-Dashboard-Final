import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'gallery-directive',
  templateUrl: './gallery.directive.html',
  styleUrls: ['./gallery.directive.scss']
})
export class GalleryDirective implements OnInit {
  constructor(){
   
  }
  @Input() images: any;
  ngOnInit() {
    
  }

  
}
