import { Component, OnInit } from '@angular/core';
import { PodchaserService } from './podchaser.service';
import 'zone.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  episodeDetails: any;
  data: any = 'initial value';
  serverUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSyz3x9RStcu6E59H21ZP9nPjYICN9xkF4ugUfhZMeDKAtm5AQGLZy1RdSyA4T7elZ-Elvup6WGTs1q/pub?output=tsv';
  public episodeArray: any
  public firstArr: any
  public secondArr: any
  public thirdArr: any;
  public winningReaders: string[] = [];
  public episodeCount = 0;
  public PODCAST_ID = '1735939';
  constructor(private podchaserService: PodchaserService) {}

  ngOnInit() {
    // this.fetchEpisodeDetails(this.PODCAST_ID, 'EPISODE_ID');  // Ersätt med relevanta ID:n
    this.fetchEpisodeDetailsByName(this.PODCAST_ID, 'Södra Latins Crazy Frog');  // Replace with actual episode name

    let arr: any = []
    let firstArr: any = []
    let secondArr: any = []
    let thirdArr: any = []
    let winningReaders: string[] = []
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
          let storiesArray = x[i]?.split('\t')[4].split('|');
          let first = x[i]?.split('\t')[5].trim();
          let second = x[i]?.split('\t')[6].trim();
          let third = x[i]?.split('\t')[7].trim();
          let guest = x[i]?.split('\t')[8];
          let pretalk = x[i]?.split('\t')[9];
          let sitting = x[i]?.split('\t')[10];
          let storiesDescriptions = x[i]?.split('\t')[11];
          let stories = [];

          for (let j = 0; j < storiesArray.length; j++) {
            let story = storiesArray[j];
            stories[j] = {
              name: story.trim(),
              id: 'sid-' + story.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
              desc: ''
            };
            story.includes(winnerstory);
          }
          if (storiesDescriptions.includes('|')) {
            let storyDescArr = storiesDescriptions.split('|');
            for (let j = 0; j < storyDescArr.length; j++) {
              let storyDesc = storyDescArr[j];
              let descObj = storyDesc.split(':');
              stories[parseInt(descObj[0]) - 1].desc = descObj[1].trim();
            }
          } else if (storiesDescriptions.trim()) {
            let descObj = storiesDescriptions.split(':');
            stories[parseInt(descObj[0]) - 1].desc = descObj[1].trim();
          }

          try {
            arr.push({
              name: name,
              winnerstory: winnerstory,
              winnerstorytime: winnerstorytime,
              winnerstorydesc: winnerstorydesc,
              winnerReader: findWinnerReader(returnWinnerStoryIndex(storiesArray, winnerstory), first, second, third),
              stories: stories,
              first: first,
              second: second,
              third: third,
              guest: guest,
              pretalk: pretalk,
              sitting: sitting,
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
              sitting: '',
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
        this.winningReaders = this.calculateOccuranceInArrayAndReturnObjectWithTwoArrays(winningReaders);
      }
    }, 200);
  }

  containsSearch(nameSearch:any, name:any) {
    if (nameSearch) {
      return true;
    }
    return true;
  }

  async fetchEpisodeDetailsByName(podcastId: string, episodeName: string) {
    console.log(podcastId, episodeName);
    try {
      const results = await this.podchaserService.searchEpisodeByName(podcastId, episodeName);
      console.log(results);
      if (results?.length > 0) {
        const episodeId = results[0].id;
        console.log(`Found episodeId: ${episodeId}`);
        this.fetchEpisodeDetails(podcastId, episodeId);
      } else {
        console.log('No episodes found.' + JSON.stringify(results));
      }
    } catch (error) {
      console.error('Error searching for episode:', error);
    }
  }

  async fetchEpisodeDetails(podcastId: string, episodeId: string) {
    try {
      this.episodeDetails = await this.podchaserService.getEpisodeDetails(podcastId, episodeId);
      console.log(this.episodeDetails);
    } catch (error) {
      console.error('Error fetching episode details:', error);
    }
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
