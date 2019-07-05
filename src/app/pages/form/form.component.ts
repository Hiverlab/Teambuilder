import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Person } from './person';
import { FormModel } from './form-model';
import { ScorePerson } from './score-person';
declare const google: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  categories = [
    {"value": ["relationship"], "name": "Event/Workshop"},
    {"value": ["strategic", "executing"], "name": "Developing Storyhive (New solutions)"},
    {"value": ["executing"], "name": "360 production"},
    {"value": ["influencing"], "name": "Presenting ideas to clients"},
    {"value": ["relationship", "influencing"], "name": "Training solution (liasing with HR dept)"}
  ]
  skills = [
    {"value": ["production"], "name": "360 Production"},
    {"value": ["techdev"], "name": "Technical Development"},
    {"value": ["creative"], "name": "Creative"},
    {"value": ["marketing"], "name": "Marketing"},
    {"value": ["admin"], "name": "Admin"},
    {"value": ["others"], "name": "Others"}
  ]
  personData: any;
  private newData: any;
  formModel = new FormModel([], []);
  personArray: Person[] = [];

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

  submit() {
    let scorePersonList: ScorePerson[][] = [];
    for (let category of this.formModel.category) {
      scorePersonList.push(this.createScorePersons(category));
    }

    for (let skill of this.formModel.skill) {
      scorePersonList.push(this.createScorePersons(skill));
    }
    console.log(scorePersonList);
  }

  createPersons(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      let person = new Person();
      Object.assign(person, data[i]);
      this.personArray.push(person);
      console.log(person.name);
    }
    console.log(this.personArray);
  }

  createScorePersons(key: string) {
    this.personArray.sort((p1, p2) => (p1[key] < p2[key]) ? 1 : -1);
    let scorePersonArray: ScorePerson[] = [];
    for (let person of this.personArray) {
      var scorePerson = new ScorePerson(person.name, person[key], person[key]);
      scorePersonArray.push(scorePerson);
    }
    console.log(key, scorePersonArray);
    return scorePersonArray;
  }
}
