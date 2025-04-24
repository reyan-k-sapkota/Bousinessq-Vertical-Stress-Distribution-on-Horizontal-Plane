const PI = 3.141592653589793;

let IB, Q, z, sigma, r, r_scale, Q_scale;

let sigma_test, sigma_plot;
let chart, stepX;



function calculate_sigma (Q, z, r){
    denominator = 1 + Math.pow (r/z, 2);
    IB = (3/(2*PI))*(1/Math.pow(denominator, 2.5));
    sigma = IB * Q/Math.pow(z, 2);
    return sigma;
}


function compute_plot_data (r, z, Q){
    const points = [];
    for (let x = -r; x <=r; x+=0.5){
        let y = calculate_sigma (Q, z, x);
        points.push ({x, y});
    }
    return points;
}



function update_chart(r, z, Q){

    var ctx = document.getElementById('chart').getContext("2d");
    

    const dataPoints = compute_plot_data(r, z, Q);
    console.log (dataPoints);
    const maxY = Math.max(...dataPoints.map(p => p.y))

    if ((maxY +0.1*maxY)/0.5 > 1000){
        stepY = 0.75;
    }else{
        stepY = 0.5;
    }


    const data = {
        datasets: [{
          label: 'Vertical Stress (kPa)',
          data: dataPoints,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          showLine: true,
          fill: false,
          tension: 0.3
        }]
      };
    
      const config = {
        type: 'line', 
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          
          scales: {
            x: {
                type: 'linear',
                
              reverse: false, 
              min: -(r+1),
              max: r+1,
              grid: {
                drawOnChartArea: true,
                
              },
              title: {
                display: true,
                text: 'Radial Distance (m)', 
                font: {
                size: 14
            }
              },
              ticks: {
                stepSize: 1
              }
            },


            y: {
              reverse: false,
              display:true,
              beginAtZero: true, 
              min: 0,
              max: maxY+ 0.1*maxY,
              grid: {
                drawOnChartArea: true
              },
              title: {
                display:true,
                text: 'Vertical Stress (kPa)',
                font: {
                    size :14
                }
              },
              ticks: {
                stepSize: stepY,
                display:true,
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
                callbacks: {
                  label: function(context) {
                    const x = context.parsed.x.toFixed(1);  // 5 decimal places
                    const y = context.parsed.y.toFixed(5);  // 5 decimal places
                    return `(${x}, ${y})`;
                  },
                }
                
              },
            annotation:{
                annotations:{
                    centerYAxis: {
                        type: 'line',
                        scaleID: 'x',
                        value: 0,
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                        borderWidth: 2,
                        // Draw Y-ticks manually
                        drawTime: 'afterDraw',
                        label: {
                          enabled: false
                        }
                      },
                      
                }
            }
           
          }
        }
      };
    
      if (chart != undefined) {
        chart.destroy();
    }

      chart = new Chart(ctx, config);
}

update_chart(9, 2, 1)