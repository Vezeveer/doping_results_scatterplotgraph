const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    renderSvg(JSON.parse(xhttp.responseText))
  }
}
xhttp.open("GET", "./data.json")
xhttp.send()

function renderSvg(data) {
  const width = 600;
  const height = 500;
  const padding = 50;

  const formatTime = d3.timeFormat("%M:%S")
  data.forEach(d => {
    let dD = new Date(d.Seconds * 1000)
    let year = new Date(d.Year, 1)
    d.Minutes = dD
    d.Year = year
  })

  const xScale = d3.scaleTime()
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
    .range([0, width])
    .nice()

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)])
    .range([0, height])
    .nice()

  const yVector = d3.scaleTime()
    .domain([d3.min(data, d => d.Minutes), d3.max(data, d => d.Minutes)])
    .range([0, height])

  const svg = d3.select('svg')
    .attr('width', width + padding + 100)
    .attr('height', height + padding + 100)

  const xAxis = d3.axisBottom().scale(xScale)
  const yAxis = d3.axisLeft(yVector).tickFormat(formatTime)

  svg.append('g')
    .attr('id', 'x-axis')
    .call(xAxis)
    .attr('transform', `translate(${padding}, ${height})`)

  svg.append('g')
    .attr('id', 'y-axis')
    .call(yAxis)
    .attr('transform', `translate(50, 0)`)

  console.log(data[0].Minutes.getSeconds())

  const text = d3.select('#tooltip')
    .append('text')
    .text('yolo')

  const circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 5)
    .attr('fill', d => d.Doping ? '#F53F3F' : '#72BCE0')
    .attr('data-yvalue', d => d.Minutes)
    .attr('data-xvalue', d => d.Year)
    .attr('cx', d => xScale(d.Year) + padding)
    .attr('cy', d => yVector(d.Minutes))
    .on('mouseover', function () {

      d3.select('#tooltip').style('display', 'block')

    })
    .on('mouseout', function () {
      d3.select('#tooltip').style('display', 'none')
    })
    .on('mousemove', function (d, i) {
      let xPos = d3.mouse(this)[0] + 10
      let yPos = d3.mouse(this)[1] - 45
      d3.select('#tooltip')
        .attr('data-year', d.Year)
        .style('left', `${xPos}px`)
        .style('top', `${yPos}px`)
        .attr('name', d.Name)
        .html(`Name: ${d.Name} <br/>
         Nationality: ${d.Nationality} <br/>
             Time: ${d.Time} <br/>
         Year: ${d.Year.getFullYear()} <br/>
          <br/>
         ${d.Doping ? d.Doping : ''}
          `)
    })


  const legend = d3.select('#legend')

  legend.append('svg')
    .attr('class', 'legendSvg')
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#F53F3F')
    .attr('cx', 25)
    .attr('cy', 8)

  d3.select('.legendSvg')
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#72BCE0')
    .attr('cx', 25)
    .attr('cy', 24)

}