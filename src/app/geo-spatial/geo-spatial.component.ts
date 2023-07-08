import { Component, OnInit } from '@angular/core';
import { VisualisationService } from 'src/services/visualisation.service';

@Component({
  selector: 'app-geo-spatial',
  templateUrl: './geo-spatial.component.html',
  styleUrls: ['./geo-spatial.component.css']
})
export class GeoSpatialComponent implements OnInit {
  constructor(private visualisation: VisualisationService) { }

  ngOnInit(): void {
    this.visualisation.geoSpatialPlot();
  }
}
