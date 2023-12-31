import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sitting-view',
  templateUrl: './sitting-view.component.html',
  styleUrls: ['./sitting-view.component.scss']
})
export class SittingViewComponent implements OnInit {
  @Input() sittingData = 'Ingen data just nu';
  public arrayData: any[] = [];
  constructor() { }

  ngOnInit(): void {
    let splitArr = this.sittingData.split(',');
    let newArr = [];
    for (let i = 0; i < splitArr.length; i++) {
      newArr.push ({
        name: splitArr[i].split(' - ')[0].trim(),
        position: splitArr[i].split(' - ')[1].trim()
      });
    }
    this.arrayData = newArr;
  }
}
