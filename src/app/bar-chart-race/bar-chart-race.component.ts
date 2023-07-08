import { Component, OnInit } from '@angular/core';
import { VisualisationService } from 'src/services/visualisation.service';

@Component({
  selector: 'app-bar-chart-race',
  templateUrl: './bar-chart-race.component.html',
  styleUrls: ['./bar-chart-race.component.css']
})
export class BarChartRaceComponent implements OnInit {

  constructor(private visualisation: VisualisationService) { }

  ngOnInit(): void {
    this.visualisation.barChartRace();
  }
}
