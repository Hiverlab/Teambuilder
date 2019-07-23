import { Component, OnInit } from '@angular/core';
import { TransferService } from './transfer.service';
import { Person } from '../form/person';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  data = this.transferService.getData();
  actualTeam: Person[] = [];
  reserveTeam: Person[] = [];

  constructor(private transferService: TransferService) {
    if (this.data) {
      this.actualTeam = this.data["actual"];
      this.reserveTeam = this.data["reserve"];
    }
  }

  ngOnInit() {
  }

}
