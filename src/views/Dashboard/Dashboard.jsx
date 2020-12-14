import React, { Fragment } from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import Graph from "react-graph-vis";
import moment from "moment"
import { Doughnut } from 'react-chartjs-2';
// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Danger from "../../components/Typography/Danger.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import { lineChart } from "../../variables/charts";

import {
  getFutureStressData,
  getMoodData,
  getRuminationData,
  getSleepData
} from "../../services/data";
import ServiceRequest from './../../services/request'
import dashboardStyle from "../../assets/jss/modules/views/dashboardStyle.jsx";

const options = {
  nodes: {
    size: 20,
    shape: "dot",
    scaling: {
      label: {
        min: 1,
        max: 1,
      },
    },
  },
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000",
    arrows: {

    }
  },
  height: "350"
};



const events = {
  select: function (event) {
    var { nodes, edges } = event;
  }
};
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      stressData: { labels: [], series: [] },
      moodData: { labels: [], series: [] },
      ruminationData: { labels: [], series: [] },
      sleepData: { labels: [], series: [] },
      nodeData: {},
      nodeDataGraph: {
        nodes: [],
        edges: []
      }
    };

    getFutureStressData().then(data => {
      this.setState({ stressData: data });
    });

    getMoodData().then(data => {
      this.setState({ moodData: data });
    });

    getRuminationData().then(data => {
      this.setState({ ruminationData: data });
    });

    getSleepData().then(data => {
      this.setState({ sleepData: data });
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  getAvg(series) {
    if (series[0]) {
      const arr = series[0];
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += parseInt(arr[i], 10);
      }
      return sum / arr.length;
    }
  }

  getDiff(series) {
    if (series[0]) {
      const arr = series[0];
      const first = arr[0];
      const last = arr[arr.length - 1];
      const diff = ((last - first) / first) * 100;
      return diff.toFixed(2);
    }
    return "N/A";
  }

  componentDidMount() {
    ServiceRequest.send({
      method: 'GET',
      path: '/info/network/'
    }).then(result => {
      const newNodeDataGraph = {
        nodes: [],
        edges: []
      }

      if (result.nodes) {
        newNodeDataGraph.nodes.push({ id: 0, label: "Node master", title: "Node master" })
        result.nodes.forEach((item) => {
          if (!item.is_master) {
            const numberNode = newNodeDataGraph.nodes.length
            newNodeDataGraph.nodes.push({ id: numberNode, label: `Node ${numberNode}`, title: `Node ${numberNode}` })
            newNodeDataGraph.edges.push({ from: 0, to: numberNode, length: 120 })
          }
        })
      }

      const newData = []
      if (result.nodes) {
        result.nodes.forEach(item => {
          if (item.is_master) {
            newData.push(item)
          }
        })
        result.nodes.forEach(item => {
          if (!item.is_master) {
            newData.push(item)
          }
        })
        result.nodes = newData
      }


      this.setState({
        nodeData: result,
        nodeDataGraph: newNodeDataGraph
      })
    })
  }

  render() {
    const { classes } = this.props;
    const { stressData, moodData, ruminationData, sleepData, nodeDataGraph, nodeData } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>warning</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Future Stress</p>
                <h3 className={classes.cardTitle}>
                  {this.getAvg(stressData.series)}/5
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Danger>
                    <Warning />
                  </Danger>
                  <a href="!#" onClick={e => e.preventDefault()}>
                    Improve your score
                  </a>
                </div>
              </CardFooter>
            </Card>

          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>insert_emoticon</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Mood</p>
                <h3 className={classes.cardTitle}>
                  {this.getAvg(moodData.series)}/5
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Last 5 Months
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>av_timer</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Rumination</p>
                <h3 className={classes.cardTitle}>
                  {this.getAvg(ruminationData.series)}/5
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Last 5 Months
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Sleep</p>
                <h3 className={classes.cardTitle}>
                  {this.getAvg(sleepData.series)}/5
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Last 5 Months
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        {
          nodeData.nodes_count ? (

            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>

                <Card chart>
                  <CardHeader color="info">
                    <Graph
                      graph={nodeDataGraph}
                      options={options}
                      events={events}
                      getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                      }}
                    />
                  </CardHeader>


                  <CardBody>
                    <h4 className={classes.cardTitle}>Network's Node</h4>
                    <p className={classes.cardCategory}>
                      <span className={classes.successText}>
                        Free  {nodeData.free_storage ? (nodeData.free_storage / 1073741824).toFixed(2) : 0} GB
                  </span>{", "}
                      <span>
                        Total {nodeData.nodes_count || 0} Node
                  </span>
                    </p>
                  </CardBody>
                  <CardFooter chart>
                    <div className={classes.stats}>
                      <AccessTime /> updated {moment().startOf('hour').fromNow()}
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
              {
                nodeData.nodes && nodeData.nodes.map((item, index) => {
                  const data = {
                    labels: [
                      'Used',
                      'Free',
                    ],
                    datasets: [{
                      data: [item.disk.used, item.disk.free],
                      backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                      ],
                      hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',

                      ]
                    }]
                  };
                  return (
                    <GridItem xs={12} sm={12} md={6}>
                      <Card >
                        <CardHeader style={{ height: '350px' }} color="blank" >
                          <div style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>Disk</div>
                          <Doughnut data={data} />
                        </CardHeader>
                        <CardBody>
                          <h4 className={classes.cardTitle}>{item.is_master ? "Node Master" : `Node ${index < 10 ? `0${index}` : index}`}</h4>
                          <p className={classes.cardCategory}>
                            <span className={classes.infoText}>
                              Total {item.disk ? (item.disk.total / 1073741824).toFixed(2) : 0} GB
                          </span>{", "}
                            <span className={classes.infoText}>
                              Now Free {(100 - item.disk.used_percent).toFixed(0)} %
                          </span>{" "}

                          </p>
                        </CardBody>
                        <CardFooter >
                          <div className={classes.stats}>
                            <AccessTime /> updated {moment().startOf('hour').fromNow()}
                          </div>
                        </CardFooter>
                      </Card>
                    </GridItem>
                  )
                })
              }


              <GridItem xs={12} sm={12} md={6}>
                <Card chart>
                  <CardHeader color="success">
                    <ChartistGraph
                      className="ct-chart"
                      data={moodData}
                      type="Line"
                      options={lineChart.options}
                      listener={lineChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Mood</h4>
                    <p className={classes.cardCategory}>
                      <span className={classes.successText}>
                        <ArrowUpward className={classes.upArrowCardCategory} />
                        {this.getDiff(moodData.series)}%
                  </span>{" "}
                      increase in 5 months.
                </p>
                  </CardBody>
                  <CardFooter chart>
                    <div className={classes.stats}>
                      <AccessTime /> updated 4 minutes ago
                </div>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <Card chart>
                  <CardHeader color="danger">
                    <ChartistGraph
                      className="ct-chart"
                      data={ruminationData}
                      type="Line"
                      options={lineChart.options}
                      listener={lineChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Rumination</h4>
                    <p className={classes.cardCategory}>
                      <span className={classes.successText}>
                        <ArrowUpward className={classes.upArrowCardCategory} />
                        {this.getDiff(moodData.series)}%
                  </span>{" "}
                      increase in 5 months.
                </p>
                  </CardBody>
                  <CardFooter chart>
                    <div className={classes.stats}>
                      <AccessTime /> updated 4 minutes ago
                </div>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <Card chart>
                  <CardHeader color="info">
                    <ChartistGraph
                      className="ct-chart"
                      data={sleepData}
                      type="Line"
                      options={lineChart.options}
                      listener={lineChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Sleep</h4>
                    <p className={classes.cardCategory}>
                      <span className={classes.successText}>
                        <ArrowUpward className={classes.upArrowCardCategory} />
                        {this.getDiff(sleepData.series)}%
                  </span>{" "}
                      increase in 5 months.
                </p>
                  </CardBody>
                  <CardFooter chart>
                    <div className={classes.stats}>
                      <AccessTime /> updated 4 minutes ago
                </div>
                  </CardFooter>
                </Card>
              </GridItem>

            </GridContainer>
          ) : null
        }
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
