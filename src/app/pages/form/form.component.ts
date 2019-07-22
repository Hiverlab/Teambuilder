import { Component, OnInit, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { TransferService } from '../tables/transfer.service';
import { Person } from './person';
import { FormModel } from './form-model';
import { Router } from '@angular/router';
import { ScorePerson } from './score-person';
import noUiSlider from "noUiSlider";
declare const google: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterContentInit {

  categories = [
    {"value": ["relationship"], "name": "Event/Workshop"},
    {"value": ["strategic", "executing"], "name": "Developing Storyhive (New solutions)"},
    {"value": ["executing"], "name": "360 production"},
    {"value": ["influencing"], "name": "Presenting ideas to clients"},
    {"value": ["relationship", "influencing"], "name": "Training solution (liasing with HR dept)"}
  ];
  skills = [
    {"name": "360 Production", "field": "production", "maxValue": "1100"},
    {"name": "Technical Development", "field": "technical", "maxValue": "1200"},
    {"name": "Creative", "field": "creative", "maxValue": "300"},
    {"name": "Marketing", "field": "marketing", "maxValue": "400"},
    {"name": "Admin", "field": "admin", "maxValue": "200"},
    {"name": "Others", "field": "others", "maxValue": "600"}
  ];
  TEAM_SIZE: number = 3;
  personData: any;
  formModel = new FormModel([], false, false, false, false, false, false);
  personArray: Person[] = [];
  slider: any;

  constructor(private dataService: DataService, private transferService: TransferService, private router: Router) { }

  ngOnInit() {
    this.personData = this.dataService.getPersons()
      .subscribe(
        (data: any) => {
          console.log('Success! Json data loaded.', data);
          this.createPersons(data['persons']);
        });
  }

  ngAfterContentInit() {
    this.slider = document.getElementById("strengths_skills_slider");
    noUiSlider.create(this.slider, {
      start: 50,
      connect: [true, false],
      step: 0.25,
      range: {
        min: 0,
        max: 100
      }
    });
  }

  createPersons(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      let person = new Person();
      Object.assign(person, data[i]);
      this.personArray.push(person);
      console.log(person);
    }
    console.log(this.personArray);
  }

  goToPage(pagename:string, parameter:string) {
    let skillsSelected: string[][] = [];
    for (let skill of this.skills) {
      if (this.formModel[skill["field"]]) {
        skillsSelected.push([skill["field"], skill["maxValue"]]);
      }
    }
    console.log("Skills selected: " + skillsSelected);
    var sliderValues = this.getSliderValues();
    let scorePersonList: ScorePerson[][] = [];
    for (let category of this.formModel.category) {
      scorePersonList.push(this.createScorePersons(category, sliderValues, skillsSelected));
    }
    let resultSet = this.createResultSet(scorePersonList);
    let resultDisplayArray = this.createResultDisplay(resultSet);
    this.transferService.setData(resultDisplayArray);
    this.router.navigate([pagename]);
  }

  getSliderValues() {
    var strengthsPercentage = this.slider.noUiSlider.get();
    var skillsPercentage = 100 - strengthsPercentage;
    console.log("Strengths: " + strengthsPercentage, "Skills: " + skillsPercentage);
    return [strengthsPercentage, skillsPercentage];
  }

  getSkillsScore(person: Person, skillsSelected: string[][]) {
    var skillsScore = 0;
    for (let skill of skillsSelected) {
      skillsScore += person[skill[0]];
    }
    return skillsScore;
  }

  createScorePersons(key: string, sliderValues: number[], skillsSelected: string[][]) {
    console.log(key.toUpperCase());
    let scorePersonArray: ScorePerson[] = [];
    for (let person of this.personArray) {
      var gallupScore = person[key] * sliderValues[0] / 100;
      var maxSkillValue = this.getMaxSkillValue(skillsSelected);
      var skillsScore = this.getSkillsScore(person, skillsSelected) * sliderValues[1] / Math.max(1, maxSkillValue);
      console.log(person.name, "Gallup score: ", gallupScore, "Skills score: ", skillsScore);
      var scorePerson = new ScorePerson(person, gallupScore + skillsScore);
      scorePersonArray.push(scorePerson);
    }
    // Sort the array in reverse order
    scorePersonArray.sort((p1, p2) => (p1.score > p2.score) ? 1 : -1);
    return scorePersonArray;
  }

  getMaxSkillValue(skillsSelected: string[][]) {
    var maxSkillValue = 0;
    for (let skill of skillsSelected) {
      maxSkillValue += Number(skill[1]);
    }
    return maxSkillValue;
  }

  createResultSet(scorePersonList: ScorePerson[][]) {
    let resultSet = new Set();
    while (scorePersonList[0].length > 0) {
      for (let scorePersonArray of scorePersonList) {
        var scorePerson = scorePersonArray.pop();
        resultSet.add(scorePerson.person);
      }
    }
    console.log(resultSet);
    return resultSet;
  }

  createResultDisplay(resultSet: Set<Person>) {
    let count = 0;
    let resultDisplayArray: Person[][] = [];
    let resultDisplayArrayElement: Person[] = [];
    for (let person of Array.from(resultSet.values())) {
      if (count == this.TEAM_SIZE) {
        resultDisplayArray.push(resultDisplayArrayElement);
        count = 0;
        resultDisplayArrayElement = [];
      }
      resultDisplayArrayElement.push(person);
      count = count + 1;
    }
    resultDisplayArray.push(resultDisplayArrayElement);
    console.log(resultDisplayArray);
    return resultDisplayArray;
  }
}
