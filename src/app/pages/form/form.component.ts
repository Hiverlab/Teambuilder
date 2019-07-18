import { Component, OnInit, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
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
  ]
  skills = [
    {"name": "360 Production", "field": "production"},
    {"name": "Technical Development", "field": "technical"},
    {"name": "Creative", "field": "creative"},
    {"name": "Marketing", "field": "marketing"},
    {"name": "Admin", "field": "admin"},
    {"name": "Others", "field": "others"}
  ]
  personData: any;
  formModel = new FormModel([], false, false, false, false, false, false);
  personArray: Person[] = [];
  slider: any;

  constructor(private dataService: DataService, private router: Router) { }

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
    let skillsSelected: string[] = [];
    for (let skill of this.skills) {
      if (this.formModel[skill["field"]]) {
        skillsSelected.push(skill["field"]);
      }
    }
    console.log("Skills selected: " + skillsSelected);
    var sliderValues = this.getSliderValues();
    let scorePersonList: ScorePerson[][] = [];
    for (let category of this.formModel.category) {
      scorePersonList.push(this.createScorePersons(category, sliderValues, skillsSelected));
    }
    console.log(scorePersonList);
    this.router.navigate([pagename]);
  }

  getSliderValues() {
    var strengthsPercentage = this.slider.noUiSlider.get();
    var skillsPercentage = 100 - strengthsPercentage;
    console.log("Strengths: " + strengthsPercentage, "Skills: " + skillsPercentage);
    return [strengthsPercentage, skillsPercentage];
  }

  getSkillsScore(person: Person, skillsSelected: string[]) {
    var skillsScore = 0;
    for (let skill of skillsSelected) {
      skillsScore += person[skill];
    }
    return skillsScore;
  }

  createScorePersons(key: string, sliderValues: number[], skillsSelected: string[]) {
    let scorePersonArray: ScorePerson[] = [];
    for (let person of this.personArray) {
      var gallupScore = person[key] * sliderValues[0] / 100;
      // TODO: Convert skill score such that value is max y%
      var skillsScore = this.getSkillsScore(person, skillsSelected) * sliderValues[1] / 100 / Math.max(1, skillsSelected.length);
      console.log(person.name, "Gallup score: ", gallupScore, "Skills score: ", skillsScore);
      var scorePerson = new ScorePerson(person, gallupScore + skillsScore);
      scorePersonArray.push(scorePerson);
    }
    scorePersonArray.sort((p1, p2) => (p1.score < p2.score) ? 1 : -1);
    console.log(key, scorePersonArray);
    return scorePersonArray;
  }
}
