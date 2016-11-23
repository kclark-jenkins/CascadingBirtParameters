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

var cascadingDownloader = $.CascadingBirtParameters(testOps);

$(document).ready(function() {
    actuate.initialize('http://ihub.demoimage.com:8700/iportal/', reqOps == undefined ? null : reqOps, 'Administrator', '', myInit);

    for(key in testOps.parameterInputMap) {
        console.log(key);
        $('#' + testOps.parameterInputMap[key]).change(function(e) {
            var parameterValues = [];

            for(paramKey in testOps.parameterInputMap) {
                var param = new actuate.viewer.impl.ParameterValue();
                    param.setName(paramKey);
                    param.setValue($('#'+testOps.parameterInputMap[paramKey]).val());
                    parameterValues.push(param);
                    cascadingDownloader.downloadCascadingParameters();
            }
        });
    }
});

function myInit() {
    var myParameters1 = new actuate.Parameter("myDiv");
    cascadingDownloader.downloadCascadingParameters();
    viewer1 = new actuate.Viewer('container1');
    viewer1.setReportDesign(testOps.designName);

    var options = new actuate.viewer.UIOptions();
    viewer1.setUIOptions(options);
    viewer1.submit();

}
