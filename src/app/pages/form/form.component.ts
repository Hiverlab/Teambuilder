import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Person } from './person';
declare const google: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  personData: any;
  private newData: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.personData = this.dataService.getPersons()
      .subscribe(
        (data: any) => {
          this.newData = data;
          console.log('Success!', this.newData);
          this.createPersons(this.newData['persons']);
        });
  }

  createPersons(data: any[]) {
    var personArray: Person[] = [];
    for (let i = 0; i < data.length; i++) {
      let person = new Person();
      Object.assign(person, data[i]);
      personArray.push(person);
      console.log(person.getName());
    }
    console.log(personArray);
    this.sortPersonsByKey("executing", personArray);
  }

  sortPersonsByKey(key: string, persons: Person[]) {
    persons.sort((p1, p2) => (p1[key] < p2[key]) ? 1 : -1);
    console.log("sorted: ", persons);
  }

}
