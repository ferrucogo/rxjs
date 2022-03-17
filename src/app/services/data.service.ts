import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  Observable,
  of,
  range,
  timer,
} from 'rxjs';
import { SeaData } from '../model/sea-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly API_URL = 'https://erddap.emodnet-physics.eu/erddap/tabledap/EP_ERD_INT_RVFL_AL_TS_NRT.csv0?time%2CRVFL%2CRVFL_QC&EP_PLATFORM_ID=%223130579%22';

  public counter = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getSeaLevelData(){
    return this.http.get<string>(this.API_URL, {responseType: 'text' as 'json'});
  }

  parseCSV(csv: string): SeaData[]{
    const seaDataArray: SeaData[] = [];
    const lines = csv.split(/\r?\n/);

    for (const line of lines) {
      const seaData = {} as SeaData[];
      const words = line.split(',');
      seaData.date = words[0];
      seaData.value = words[1];
      seaDataArray.push(seaData);      
    }

    return seaDataArray;
  }; 

  createInterval(): Observable<string> {
    return interval(1000).pipe(
      filter((number) => number % 2 === 0),
      map((number) => 'numero ' + number)
    );
  }

  createTimer(): Observable<string> {
    return timer(5000, 2000).pipe(
      filter((number) => number % 2 === 0),
      map((number) => 'numero ' + number)
    );
  }

  getObservableArray(): Observable<number[]> {
    const array = [0, 5, 8, 12, 6];
    return of(array).pipe(map((array) => array.map((numb) => numb + 1)));
  }

  getRange(): Observable<number> {
    return range(0, 2000).pipe(filter((number) => number % 2 === 0));
  }

  getCounter(): Observable<number> {
    return this.counter.pipe(map((numb) => numb ** numb));
  }
}
