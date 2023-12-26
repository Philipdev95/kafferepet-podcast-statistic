import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() iconName = 'default-face';
  @Input() heightPX = '30';
  constructor() { }

  ngOnInit(): void {
    this.iconName = this.iconName.toLowerCase();
  }

}
