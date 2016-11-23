actuate.load('viewer');
actuate.load('parameter');

var reqOps = new actuate.RequestOptions();
    reqOps.setRepositoryType('Enterprise');
    reqOps.setVolume('Default Volume');
    reqOps.setCustomParameters({});

var testOps = {
    designName:        '/Applications/BIRT Sample App/Report Designs/Product Orders by Customer.rptdesign;1',
    parametersDivID:   'myDiv',
    parameterInputMap: {
        pCountry: 'CountryInput',
        pCustomer: 'CustomerInput'
    }
};

var viewer1;

var cascadingDownloader = $.CascadingBirtParameters(testOps);

$(document).ready(function() {
    actuate.initialize('http://ihub.demoimage.com:8700/iportal/', reqOps == undefined ? null : reqOps, 'Administrator', '', myInit);
    for(key in testOps.parameterInputMap) {
        console.log(key);
        $('#' + testOps.parameterInputMap[key]).change(function(e) {
            var parameterValues = [];
            var pMap = {};
            for(paramKey in testOps.parameterInputMap) {
                    var param = new actuate.viewer.impl.ParameterValue();
                    pMap[paramKey] = $('#'+testOps.parameterInputMap[paramKey]).val();
                    param.setName(paramKey);
                    param.setValue($('#'+testOps.parameterInputMap[paramKey]).val());
                    parameterValues.push(param);
                    //console.log(pMap);
            }

            for (var key in pMap) {
                var param = new actuate.viewer.impl.ParameterValue();
                param.setName(key);
                if (pMap[key] != null) {
                    param.setValue($('#'+testOps.parameterInputMap[key]).val());
                } else {
                    param.setValueIsNull(true);
                }
                parameterValues.push(param);
            }

            console.log(parameterValues.splice(2,2));
            viewer1.setParameterValues(parameterValues.splice(2,2));
            viewer1.submit(function(){
                cascadingDownloader.downloadCascadingParameters(parameterValues);
            });
        });
    }
});

function myInit() {
    viewer1 = new actuate.Viewer('container1');
    viewer1.setReportDesign(testOps.designName);

    var options = new actuate.viewer.UIOptions();
    viewer1.setUIOptions(options);
    viewer1.submit(function(){
        cascadingDownloader.downloadCascadingParameters();
    });

}
