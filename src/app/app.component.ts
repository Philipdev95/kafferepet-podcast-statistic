import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'zone.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  data: any = 'initial value';
  serverUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSyz3x9RStcu6E59H21ZP9nPjYICN9xkF4ugUfhZMeDKAtm5AQGLZy1RdSyA4T7elZ-Elvup6WGTs1q/pub?output=tsv';
  public episodeArray: any
  public firstArr: any
  public secondArr: any
  public thirdArr: any;
  public nameSearch = '';
  public names = [{name: 'Adele', show: true},{name: 'Agnes', show: true},{name: 'Billy', show: true},{name: 'Bob', show: true},{name: 'Calvin', show: true},{name: 'Christina', show: true},{name: 'Cindy', show: true}]
  constructor(private httpClient: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {
    let arr: any = []
    let firstArr: any = []
    let secondArr: any = []
    let thirdArr: any = []
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.serverUrl);
    xhr.onload = function () {
      let x = xhr.responseText.split('\n')
      for (let i = 0; i < x.length; i++) {
        function returnWinnerStoryIndex(stories:any, winnerstory:any) {
          for (let j = 0; j < stories.length; j++) {
            if (stories[j].includes(winnerstory) && winnerstory) {
              return j;
            }
          }
          return -1;
        }
        if (x[i].split('\t')[0] !== 'Avsnittsnamn') {
          let name = x[i]?.split('\t')[0];
          let winnerstory = x[i]?.split('\t')[1];
          let winnerstorytime = x[i]?.split('\t')[2];
          let winnerstorydesc = x[i]?.split('\t')[3];
          let stories = x[i]?.split('\t')[4].split('|');
          let first = x[i]?.split('\t')[5];
          let second = x[i]?.split('\t')[6];
          let third = x[i]?.split('\t')[7];
          let guest = x[i]?.split('\t')[8];
          let pretalk = x[i]?.split('\t')[9];
          for (let j = 0; j < stories.length; j++) {
            stories[j].includes(winnerstory)
          }
          try {
            arr.push({
              name: name,
              winnerstory: winnerstory,
              winnerstorytime: winnerstorytime,
              winnerstorydesc: winnerstorydesc,
              winnerstoryindex: returnWinnerStoryIndex(stories, winnerstory),
              stories: stories,
              first: first,
              second: second,
              third: third,
              guest: guest,
              pretalk: pretalk,
              show: true
            })
          }
          catch(err) {
            arr.push({
              name: '',
              winnerstory: '',
              winnerstorytime: '',
              winnerstorydesc: '',
              winnerstoryindex: -1,
              stories: ['Inget ännu.'],
              first: '',
              second: '',
              third: '',
              guest: '',
              pretalk: '',
              show: true
            })
            console.log(err);
          }
          firstArr.push(x[i].split('\t')[5])
          secondArr.push(x[i].split('\t')[6])
          thirdArr.push(x[i].split('\t')[7])
        }
      }
    };
    xhr.onerror = function () {
      console.log(xhr.statusText)
    };
    xhr.send();
    this.episodeArray = arr;
    let interval: any = null
    let stopIinterval = false
    interval = setInterval(() => {
      if (firstArr[0]) {
        stopIinterval = true;
      }
      if (stopIinterval) {
        clearInterval(interval)
        this.firstArr = this.calculateOccuranceInArrayAndReturnObjectWithTwoArrays(firstArr)
        this.secondArr = this.calculateOccuranceInArrayAndReturnObjectWithTwoArrays(secondArr)
        this.thirdArr = this.calculateOccuranceInArrayAndReturnObjectWithTwoArrays(thirdArr)
      }
    }, 200);
  }

  numberIsDevisibleByThree(number:any) {
    return number % 3 === 0;
  }
  numberIsDevisibleByTwo(number:any) {
    return number % 2 === 0;
  }
  numberisdevisablebyone(number:any) {
    return number % 1 === 0;
  }

  containsSearch(nameSearch:any, name:any) {
    if (nameSearch) {
      return true;
    }
    return true;
  }

  public send(val:any) {
    for (let i = 0; this.episodeArray.length; i++) {
      const episode = JSON.stringify(this.episodeArray[i])
      const x = val.target.value.toLowerCase()
      if (!episode) {
        return
      }
      if (episode.toLowerCase().includes(x)) {
        this.episodeArray[i].show = true;
      } else {
        this.episodeArray[i].show = false;
      }
    }
  }

  calculateOccuranceInArrayAndReturnObjectWithTwoArrays(countThisArray:any): any {
    var counts:any = [ [], [] ]
    for (var i = 0; i < countThisArray.length; i++) {
      if (!counts[0].includes(countThisArray[i])) {
        counts[0].push(countThisArray[i])
        counts[1].push(1)
      } else {
        counts[1][counts[0].indexOf(countThisArray[i])]++
      }
    }
    return counts
  }
}
