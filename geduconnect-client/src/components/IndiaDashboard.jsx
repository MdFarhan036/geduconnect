import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import indiaGeo from "./india.json"; // Put India GeoJSON in src folder

export default function IndiaDashboard() {
  const cities = [
    { name: "Jaipur", value: [75.7873, 26.9124, 50] },
    { name: "Mumbai", value: [72.8777, 19.0760, 70] },
    { name: "Delhi", value: [77.1025, 28.7041, 90] },
    { name: "Ahmedabad", value: [72.5714, 23.0225, 40] },
    { name: "Bangalore", value: [77.5946, 12.9716, 60] },
  ];

  // Register India Map
  echarts.registerMap("india", indiaGeo);

  const option = {
    backgroundColor: "#f8f9fc",

    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (params.seriesType === "effectScatter") {
          return `
            <strong>${params.name}</strong><br/>
            Consultants: ${params.value[2]}
          `;
        }
        return params.name;
      },
    },

    geo: {
      map: "india",
      roam: true,
      zoom: 1.2,
      itemStyle: {
        areaColor: "#bbdefb",
        borderColor: "#1565c0",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#1976d2",
        },
      },
    },

    series: [
      {
        name: "Consultants",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: cities,
        symbolSize: function (val) {
          return val[2] / 5; // Size based on count
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        itemStyle: {
          color: "#0d47a1",
        },
      },
    ],
  };

  return (
    <div style={{ padding: "80px 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Consultant Network 2025
      </h2>

      <ReactECharts
        option={option}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "16px",
        }}
      />
    </div>
  );
}