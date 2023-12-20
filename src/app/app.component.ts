import { Component, OnInit } from '@angular/core';
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
  public episodeCount = 0
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    let arr: any = []
    let firstArr: any = []
    let secondArr: any = []
    let thirdArr: any = []
    const winningReaders = []
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
        function findWinnerReader(winnerStoryIndex:number, first:string, second:string, third:string) {
          const hosts = [first, second, third];
          const readerIndex = winnerStoryIndex % 3;

          if (readerIndex >= 0 && readerIndex < 3) {
            const reader = hosts[readerIndex];
            winningReaders.push(reader);
            return reader;
          } else {
            return null;
          }
        }
        if (x[i].split('\t')[0] !== 'Avsnittsnamn') {
          let name = x[i]?.split('\t')[0];
          let winnerstory = x[i]?.split('\t')[1];
          let winnerstorytime = x[i]?.split('\t')[2];
          let winnerstorydesc = x[i]?.split('\t')[3];
          let stories = x[i]?.split('\t')[4].split('|');
          let first = x[i]?.split('\t')[5].trim();
          let second = x[i]?.split('\t')[6].trim();
          let third = x[i]?.split('\t')[7].trim();
          let guest = x[i]?.split('\t')[8];
          let pretalk = x[i]?.split('\t')[9];
          for (let j = 0; j < stories.length; j++) {
            let story = stories[j];
            stories[j] = story.trim();
            story.includes(winnerstory)
          }
          try {
            arr.push({
              name: name,
              winnerstory: winnerstory,
              winnerstorytime: winnerstorytime,
              winnerstorydesc: winnerstorydesc,
              winnerReader: findWinnerReader(returnWinnerStoryIndex(stories, winnerstory), first, second, third),
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
              winnerReader: '',
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
          firstArr.push(x[i].split('\t')[5].trim());
          secondArr.push(x[i].split('\t')[6].trim());
          thirdArr.push(x[i].split('\t')[7].trim());
          
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

  containsSearch(nameSearch:any, name:any) {
    if (nameSearch) {
      return true;
    }
    return true;
  }

  public send(val:any) {
    for (let i = 0; this.episodeArray.length; i++) {
      const episode = JSON.stringify(this.episodeArray[i]);
      const x = val.target.value.toLowerCase();
      if (!episode) {
        return;
      }
      if (episode.toLowerCase().includes(x)) {
        this.episodeArray[i].show = true;
      } else {
        this.episodeArray[i].show = false;
      }
    }
  }

  calculateOccuranceInArrayAndReturnObjectWithTwoArrays(countThisArray:any): any {
    var counts:any = [ [], [] ];
    for (var i = 0; i < countThisArray.length; i++) {
      if (!counts[0].includes(countThisArray[i])) {
        counts[0].push(countThisArray[i]);
        counts[1].push(1);
      } else {
        counts[1][counts[0].indexOf(countThisArray[i])]++;
      }
    }

    // Sort the arrays based on the count (descending order)
    counts[0].sort(function (a: any, b: any) {
      var indexA = counts[0].indexOf(a);
      var indexB = counts[0].indexOf(b);
      return counts[1][indexB] - counts[1][indexA];
    });

    counts[1].sort(function (a: any, b: any) {
      return b - a;
    });

    return counts;
  }
}
