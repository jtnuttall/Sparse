import { Component, OnInit, ElementRef } from '@angular/core';
import { GraphService } from '../../../core/services/graph/graph.service';
import { Fight } from 'src/app/models/fight.model';
import * as d3 from 'd3';
import { CombatLine } from 'src/app/models/combat-line.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit {
  fight: Fight;
  data: Array<{time: number, damage: number}>;

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3.Line<[number, number]>;

  // svg: any;
  // g: any;
  // x: any;
  // y: any;

  constructor(
    private readonly graphService: GraphService,
    private readonly hostElement: ElementRef
  ) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    // this.graphInit();

    this
      .graphService
      .fight
      .subscribe({
        next: fight => {
          this.fight = fight;
          this.data = this.fight.damage;
          this.initSvg();
          this.initAxis();
          this.drawAxis();
          this.drawLine();
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
      this.x = d3.scaleLinear().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.height, 0]);
      this.x.domain(d3.extent(this.data, (d) => d.time ));
      this.y.domain(d3.extent(this.data, (d) => d.damage ));
  }

  private drawAxis() {

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.x));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');
  }

  private drawLine() {
      this.line = d3.line()
          .x( (d: any) => this.x(d.time) )
          .y( (d: any) => this.y(d.damage) );

      this.svg.append('path')
          .datum(this.data)
          .attr('class', 'line')
          .attr('d', this.line);
  }
}
