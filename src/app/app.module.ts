import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BarChartRaceComponent } from './bar-chart-race/bar-chart-race.component';
import { GeoSpatialComponent } from './geo-spatial/geo-spatial.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BarChartRaceComponent,
    GeoSpatialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
