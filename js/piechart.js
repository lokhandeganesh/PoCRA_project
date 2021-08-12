var districtName,total,g_other,c_other,c_others,sc,st,male,female,dtnCode;
$.ajax({
    'async': false,
    'type': "GET",
    'global': false,
    'dataType': 'json',
    'url': "http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/dbt_data?dist_code=501",
    // 'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
    'success': function (result) {
        // console.log(data)
        c_other = result.dbt_data[0].c_others;

        districtName = result.dbt_data[0].district;
        dtnCode = result.dbt_data[0].dtncode;

        total = parseFloat(result.dbt_data[0].total);

        g_other = parseFloat(result.dbt_data[0].g_other);
        male = parseFloat(result.dbt_data[0].male);
        female = parseFloat(result.dbt_data[0].female);

        c_others = parseFloat(result.dbt_data[0].c_others);
        sc = parseFloat(result.dbt_data[0].sc);
        st = parseFloat(result.dbt_data[0].st);

    }
});

// Make monochrome colors
// var pieColors = (function () {
//     var colors = [],
//         base = Highcharts.getOptions().colors[0],
//         i;

//     for (i = 0; i < 10; i += 1) {
//         // Start out with a darkened base color (negative brighten), and end
//         // up with a much brighter color
//         colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
//     }
//     return colors;
// }());

// Build the chart

Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        style: {
        color: '#FF0000',
        fontWeight: 'bold'
    },
        text: 'DBT Distribution as per Gender'
    },
    subtitle: {
        style: {            
            fontWeight: 'bold'
        },
        text: 'Distrcit : ' + districtName +
        "<br/>Total Application recieved : " + total
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            // colors: pieColors,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Total',
        colorByPoint: true,
        data: [
            {
                name: 'Male', y: male,
                color: '#22A8DB',
                sliced: true,
                selected: true
            },
            {
                name: 'Female', y: female,
                color: '#FC0F3A'
            },
            { name: 'Other', y: g_other }
        ]
    }]
    // ,
    // caption: {
    //     style: {            
    //         fontWeight: 'bold',                       
    //     },
    //     text: "Total Application recieved : " + total
    // }
});
// Category wise
Highcharts.chart('container1', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        style: {
            color: '#FF0000',
            fontWeight: 'bold'
        },
        text: 'DBT Distribution through Social Category'
    },
    subtitle: {
        style: {            
            fontWeight: 'bold'
        },
        text: 'Distrcit : ' + districtName +
        "<br/>Total Application recieved : " + total        
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            // colors: pieColors,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Total',
        colorByPoint: true,
        data: [
            {
                name: 'Schedule Tribe', y: st,
                color: '#22A8DB'
            },
            {
                name: 'Schedule Cast', y: sc,
                color: '#FC0F3A'
            },
            { name: 'General', y: c_others,
            sliced: true,
            selected: true
         }
        ]
    }]
});