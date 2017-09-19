/**
 * Created by Posh on 6/8/17.
 */
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import { ListenerSummaryEvent } from '../../../../models/events';

let d3Selection = require('d3-selection');
let LineChart = require('britecharts/dist/umd/line.min');
let ToolTip = require('britecharts/dist/umd/tooltip.min');

@Component({
    selector: 'app-listeners',
    templateUrl: 'components/control/control-components/listeners/listeners.tmpl.html'
})
export class ListenersComponent implements OnInit, AfterViewInit {
    @Input() listenerStats: ListenerSummaryEvent[];
    graphData;

    topicKeyMap = [
        { key: 'listenerCount', text: 'Listening' },
        { key: 'inboundCount', text: 'Inbound' },
        { key: 'outboundCount', text: 'Outbound' },
        { key: 'onlineCount', text: 'Online' },
        { key: 'handRaisedCount', text: 'Hand Raised' },
        { key: 'screeningCount', text: 'Screening' },
        { key: 'screenedCount', text: 'Screened' },
        { key: 'ondeckCount', text: 'On Deck' },
        { key: 'liveCount', text: 'Live' },
        { key: 'peakCount', text: 'Peak' }
    ];

    lineChart;
    chartTooltip;
    graphContainer;
    containerWidth = 800;
    tooltipContainer;

    showGraph: boolean = false;

    constructor() {
    }

    ngOnInit() {
        //this.startDynamicDataTimer();
    }

    ngAfterViewInit() {
    }

    updateGraphData(data) {
        console.log('graph data rec obj : ', data);

        let date = this.toLocal(new Date(data.timestamp));

        console.log('updating graph data for : ', date);

        if (!this.graphData) {
            // Prepare graph data
            let dataByTopic = [];

            this.topicKeyMap.forEach((val, key) => {
                this[val.key] = data[val.key];

                dataByTopic.push({
                    topicName: val.text,
                    topic: key + 1,
                    dates: [
                        {
                            date: date,
                            value: data[val.key],
                        }
                    ]
                });
            });

            this.graphData = {
                dataByTopic: dataByTopic
            };
        } else {
            this.topicKeyMap.forEach((val, key) => {
                this[val.key] = data[val.key];

                this.graphData.dataByTopic[key].dates.push({
                    date: date,
                    value: data[val.key],
                });
            });
        }

        this.refreshGraph();
    }

    refreshGraph() {
        this.showGraph = false;

        setTimeout(() => {
            this.showGraph = true;
        }, 0);

        setTimeout(() => {
            this.drawGraph();
        });
    }

    drawGraph() {
        // Draw graph
        this.lineChart = new LineChart();
        this.chartTooltip = ToolTip();
        this.graphContainer = d3Selection.select('.js-line-chart-container');
        this.containerWidth = 800;

        if (this.graphContainer && this.graphData) {
            let lineMargin = {top: 60, bottom: 50, left: 50, right: 30};

            // LineChart Setup and start
            this.lineChart
                .isAnimated(true)
                .aspectRatio(0.7)
                .grid('horizontal')
                .tooltipThreshold(500)
                .width(this.containerWidth)
                .margin(lineMargin)
                .forceAxisFormat(this.lineChart.axisTimeCombinations.MINUTE_HOUR)
                .on('customMouseOver', this.chartTooltip.show)
                .on('customMouseMove', this.chartTooltip.update)
                .on('customMouseOut', this.chartTooltip.hide);

            this.graphContainer.datum(this.graphData).call(this.lineChart);

            // Tooltip Setup and start
            this.chartTooltip
            // In order to change the date range on the tooltip title, uncomment this line
                .forceDateRange(this.chartTooltip.axisTimeCombinations.MINUTE_HOUR)
                .title('Listeners')
                .forceOrder(this.graphData.dataByTopic.map(function (topic) {
                    return topic.topic;
                }));

            // Note that if the viewport width is less than the tooltipThreshold value,
            // this container won't exist, and the tooltip won't show up
            this.tooltipContainer = d3Selection.select('.js-line-chart-container .metadata-group .hover-marker');
            this.tooltipContainer.datum([]).call(this.chartTooltip);
        }
    }

    toLocal(date) {
        let local = new Date(date);
        //local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON();
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    startDynamicDataTimer() {
        let min = 0, max = 20;

        setInterval(() => {
            this.updateGraphData({
                timestamp: Date.now(),
                listenerCount: this.getRandomInt(min, max),
                inboundCount: this.getRandomInt(min, max),
                outboundCount: this.getRandomInt(min, max),
                count: this.getRandomInt(min, max),
                handRaisedCount: this.getRandomInt(min, max),
                screeningCount: this.getRandomInt(min, max),
                screenedCount: this.getRandomInt(min, max),
                ondeckCount: this.getRandomInt(min, max),
                liveCount: this.getRandomInt(min, max),
                peak: this.getRandomInt(min,max)
            });
        }, 1000 * 10);
    }
}