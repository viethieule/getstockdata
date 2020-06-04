function load() {
    // var stockId = $("#stock").val();
    // var fromDate = $("#from").val();
    // var toDate = $("#to").val();
    var stockId = "AAA";
    var fromDate = "2020-06-04";
    var toDate = "2020-06-04";

    $.get(
        `https://finfo-api.vndirect.com.vn/v3/stocks/intraday/history?symbols=${stockId}&sort=-time&limit=1000&fromDate=${fromDate}&toDate=${toDate}&fields=symbol,last,lastVol,time`,
        (data) => {
            if (data && data.data && data.data.hits) {
                let html = data.data.hits
                    .map((hit) => {
                        const { last, lastVol, time } = hit._source;
                        return `<tr><td>${last}</td><td>${lastVol / 1000}</td><td>${time}</td></tr>`;
                    })
                    .join("");
                $("#data").html(html);

                createChart(data.data.hits);
            } else {
                alert(`Data not exists from ${fromDate} to ${toDate}!`);
            }
        }
    );
}

function createChart(hits) {
    const dict = hits.reduce((accumulator, hit) => {
        const { last, lastVol } = hit._source;
        if (accumulator[last] || accumulator[last] === 0) {
            accumulator[last] += lastVol / 1000;
        } else {
            accumulator[last] = lastVol / 1000;
        }
        return accumulator;
    }, {});

    const labels = Object.keys(dict).sort(compare);
    const data = [];

    labels.forEach(label => {
        data.push(Math.round(dict[label] * 100) / 100);
    });

    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "horizontalBar",

        // The data for our dataset
        data: {
            labels,
            datasets: [
                {
                    label: "Bieu do khop lenh theo buoc gia",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgb(255, 99, 132)",
                    borderWidth: 2,
                    data,
                    datalabels: {
                        color: '#2b0202',
                        align: 'right',
                        anchor: 'end'
                    }
                },
            ],
        },

        // Configuration options go here
        options: {
            responsive: false,
            tooltips: {
                enabled: false
            }
        },
    });
    var button = document.getElementById("load");
    button.addEventListener("click", function () {
        chart.destroy();
    });
}

function compare(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

$(document).ready(() => { });
