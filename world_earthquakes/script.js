const weightColor = d3.scaleLinear()
    .domain([0, 60])
    .range(['lightblue', 'darkred'])
    .clamp(true);

const myGlobe = Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .hexBinPointLat(d => d.geometry.coordinates[1])
    .hexBinPointLng(d => d.geometry.coordinates[0])
    .hexBinPointWeight(d => d.properties.mag)
    .hexAltitude(({
        sumWeight
    }) => sumWeight * 0.0025)
    .hexTopColor(d => weightColor(d.sumWeight))
    .hexSideColor(d => weightColor(d.sumWeight))
    .hexLabel(d => `
        <b>${d.points.length}</b> earthquakes in the past month:<ul><li>
          ${d.points.slice().sort((a, b) => b.properties.mag - a.properties.mag).map(d => d.properties.title).join('</li><li>')}
        </li></ul>
      `)
    (document.getElementById('globeViz'));

fetch('//earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson').then(res => res.json()).then(equakes => {
    myGlobe.hexBinPointsData(equakes.features);
});