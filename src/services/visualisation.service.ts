import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  constructor() { }

  barChartRace() {

    let container_width = document.querySelector(".visual_container")!.getBoundingClientRect().width;
    let container_height = document.querySelector(".visual_container")!.getBoundingClientRect().height;

    var svg = d3.select(".visual_container").append("svg")
      .attr("width", container_width)
      .attr("height", container_height);



    var tickDuration = 500;

    var top_n = 20;
    var height = container_height;
    var width = container_width;

    const margin = {
      top: 30,
      right: 10,
      bottom: 10,
      left: 10
    };

    let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

    let year = 2020.022;

    d3.json('./assets/data.json').then(function (data: any) {
      console.log(data);

      data.forEach((d: any) => {
        d.value = +d.value,
          d.lastValue = +d.lastValue,
          d.value = isNaN(d.value) ? 0 : d.value,
          d.year = +d.year,
          d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75)
      });

      console.log(data);

      let yearSlice: [] = data.filter((d: any) => d.year == year && !isNaN(d.value))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, top_n);

      console.log(yearSlice);


      yearSlice.forEach((d: any, i: any) => d.rank = i);

      console.log('yearSlice: ', yearSlice)

      let x = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, (d: any) => d.value)])
        .range([margin.left, width - margin.right - 65]);

      let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

      let xAxis = d3.axisTop(x)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

      svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);

      svg.selectAll('rect.bar')
        .data(yearSlice, (d: any) => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', (d: any) => x(d.value) - x(0) - 1)
        .attr('y', (d: any) => y(d.rank) + 5)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', (d: any) => d.colour);

      svg.selectAll('text.label')
        .data(yearSlice, (d: any) => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d: any) => x(d.value) - 8)
        .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html((d: any) => d.name);

      svg.selectAll('text.valueLabel')
        .data(yearSlice, (d: any) => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', (d: any) => x(d.value) + 5)
        .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .text((d: any) => d3.format(',.0f')(d.lastValue));

      let yearText = svg.append('text')
        .attr('class', 'yearText')
        .attr('x', width - margin.right)
        .attr('y', height - 25)
        .style('text-anchor', 'end')
        .html(year.toFixed(0).toString() + "/" + (Math.ceil(parseInt(year.toString().split(".")[1]) / 30).toFixed(0)))

      let ticker = d3.interval(e => {

        yearSlice = data.filter((d: any) => d.year == year && !isNaN(d.value))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, top_n);

        yearSlice.forEach((d: any, i: any) => d.rank = i);

        //console.log('IntervalYear: ', yearSlice);

        x.domain([0, d3.max(yearSlice, function (d: any) { return d.value })]);

        xAxis(svg.select('.xAxis'));

        let bars = svg.selectAll('.bar').data(yearSlice, (d: any) => d.name);

        bars
          .enter()
          .append('rect')
          .attr('class', (d: any) => `bar ${d.name.replace(/\s/g, '_')}`)
          .attr('x', x(0) + 1)
          .attr('width', (d: any) => x(d.value) - x(0) - 1)
          .attr('y', (d: any) => y(top_n + 1) + 5)
          .attr('height', y(1) - y(0) - barPadding)
          .style('fill', (d: any) => d.colour)
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', (d: any) => y(d.rank) + 5);

        bars
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', (d: any) => x(d.value) - x(0) - 1)
          .attr('y', (d: any) => y(d.rank) + 5);

        bars
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', (d: any) => x(d.value) - x(0) - 1)
          .attr('y', (d: any) => y(top_n + 1) + 5)
          .remove();

        let labels = svg.selectAll('.label')
          .data(yearSlice, (d: any) => d.name);

        labels
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', (d: any) => x(d.value) - 8)
          .attr('y', (d: any) => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2))
          .style('text-anchor', 'end')
          .html((d: any) => d.name)
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);


        labels
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', (d: any) => x(d.value) - 8)
          .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

        labels
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', (d: any) => x(d.value) - 8)
          .attr('y', (d: any) => y(top_n + 1) + 5)
          .remove();



        let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, (d: any) => d.name);

        valueLabels
          .enter()
          .append('text')
          .attr('class', 'valueLabel')
          .attr('x', (d: any) => x(d.value) + 5)
          .attr('y', (d: any) => y(top_n + 1) + 5)
          .text((d: any) => d3.format(',.0f')(d.lastValue))
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

        valueLabels
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', (d: any) => x(d.value) + 5)
          .attr('y', (d: any) => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
          .tween("text", function (d: any) {
            let i = d3.interpolateRound(d.lastValue, d.value);
            console.log(i);

            return function (t) {
              return d3.format(',')(i(t));
            };
          });


        valueLabels
          .exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', (d: any) => x(d.value) + 5)
          .attr('y', (d: any) => y(top_n + 1) + 5)
          .remove();

        yearText.html(year.toFixed(0).toString() + "/" + (Math.ceil(parseInt(year.toString().split(".")[1]) / 30)));

        if (year == 2021.019) ticker.stop();
        console.log("Prevoius" + year);

        if (year.toString() == "2020.366") {
          year = 2021.0
          year = parseFloat(d3.format('.3f')((+year) + 0.001));
        } else {
          year = parseFloat(d3.format('.3f')((+year) + 0.001));
        }
        // year = parseFloat(d3.format('.1f')((+year) + 0.1));
        console.log(year);

      }, tickDuration);

    });

    // const halo = function (text: any, strokeWidth: any) {
    //   text.select(function () { return parentNode.insertBefore(this.cloneNode(true), this); })
    //     .style('fill', '#ffffff')
    //     .style('stroke', '#ffffff')
    //     .style('stroke-width', strokeWidth)
    //     .style('stroke-linejoin', 'round')
    //     .style('opacity', 1);
    // }
  }

  async geoSpatialPlot(showCases: boolean = true, showDeaths: boolean = false) {

    let container_width = document.querySelector(".visual_container")!.getBoundingClientRect().width;
    let container_height = document.querySelector(".visual_container")!.getBoundingClientRect().height;

    let tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("top", "0px")
      .style("left", "0px")
      .style("visibility", "hidden")
      .style("padding", "10px")
      .style("opacity", "0.9")
      .style("color", "black")
      .style("font-family", "sans-serif")

    var svg = d3.select(".visual_container").append("svg")
      .attr("width", container_width)
      .attr("height", container_height);

    let zoomHandler = (e: any) => {
      d3.select('svg g').attr('transform', e.transform);
    }

    let covid_data;
    let min_covid_cases = 0;
    let max_covid_cases = 0;
    let min_covid_deaths = 0;
    let max_covid_deaths = 0;

    await d3.json("./assets/covid.json").then((data: any) => {
      covid_data = data;
      min_covid_cases = parseInt(d3.min<any>(covid_data.map((d: any) => {
        return d.cases;
      })));
      max_covid_cases = parseInt(d3.max<any>(covid_data.map((d: any) => {
        return d.cases;
      })));
      min_covid_deaths = parseInt(d3.min<any>(covid_data.map((d: any) => {
        return d.deaths;
      })));
      max_covid_deaths = parseInt(d3.max<any>(covid_data.map((d: any) => {
        return d.deaths;
      })));
    })

    let covid2: any;

    await d3.json("./assets/covid2.json").then((data: any) => {
      covid2 = data;
    })

    console.log(covid_data);


    let covidCasesColorScale = d3.scaleSequential(d3.interpolateReds)
      .domain([min_covid_cases, max_covid_cases])

    let covidDeathsColorScale = d3.scaleSequential(d3.interpolateReds)
      .domain([min_covid_deaths, max_covid_deaths])


    let zoom: any = d3.zoom().on('zoom', zoomHandler);

    var g = svg.append('g');

    var projection = d3.geoMercator()
      .scale(250)
      .center([0, 0])
      .translate([container_width / 2, container_height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    d3.json("./assets/world.geojson")
      .then((data: any) => {
        console.log(data);

        g.selectAll('path')
          .data(data["features"])
          .enter()
          .append('path')
          .attr("stroke", "black")
          .attr('d', (d: any) => {
            return pathGenerator(d);
          })

        setTimeout(() => {
          g.selectAll('path').attr('fill', (d: any) => {
            console.log(d);

            let color = "black";
            let country = covid2[d['properties']['name']];
            if (showCases && country != undefined) {
              console.log(showCases, country["cases"]);

              color = covidCasesColorScale(country["cases"]);
            }
            else if (showDeaths && country != undefined) {
              color = covidDeathsColorScale(d["deaths"])
            }
            return color;
          })
            .on("mouseenter", (d: any) => {
              let country = covid2[d["target"]["__data__"]['properties']['name']];
              console.log(d["target"]["__data__"]["properties"]["name"], d["target"]["__data__"]["id"]);
              tooltip.style("visibility", "visible")
              tooltip.html(`<p>${d["target"]["__data__"]["properties"]["name"]}</p><p>Total Cases : ${country["cases"]}</p><p>Total Deaths : ${country["deaths"]}</p>`)
            })
            .on('mousemove', (d: any) => {
              tooltip.style("transform", `translate(${d.pageX}px, ${d.pageY}px)`).style("visibility", "visible")
            })
            .on("mouseout", () => {
              tooltip.style("visibility", "hidden")
            });
        }, 100);

        svg.call(zoom)
      })

  }
}
