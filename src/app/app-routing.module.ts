import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartRaceComponent } from './bar-chart-race/bar-chart-race.component';
import { GeoSpatialComponent } from './geo-spatial/geo-spatial.component';

const routes: Routes = [
  { path: '', component: BarChartRaceComponent },
  { path: 'geo-spatial-plot', component: GeoSpatialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
