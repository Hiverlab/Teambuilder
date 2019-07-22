import { Component, OnInit } from '@angular/core';
import { TransferService } from './transfer.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  data = this.transferService.getData();

  constructor(private transferService: TransferService) {
  }

  ngOnInit() {
  }

}
