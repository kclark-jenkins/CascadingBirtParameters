(function ($) {
    $.cascadingBirtParameters = function (userOptions) {
        var defaults = {
                username:         'Administrator',
                password:         '',
                parameterID:      'parameters1',
                parameters:       null,
                rptdesign:        '/Applications/BIRT Sample App/Report Designs/Product Orders by Customer.rptdesign;1',
                actuateLibraries: 'parameter',
                reqOpts:          null,
                actOpts:          null,
                repoType:         'Enterprise',
                volume:           'Default Volume',
                parameterValues:  null,
                iportal:          'http://ihub.demoimage.com:8700/iportal/',
                initCallback:     null
            },
            plugin  = this,
            options = userOptions || {};


        plugin.init = function () {
            var settings = $.extend({}, defaults, options);
            $.data(document, 'CascadingBirtParameters', settings);
            actuate.load('parameter');
            plugin.setReqOpts();
            $('#'+settings.parameterID).hide();
            plugin.actInit();
        };

        plugin.setReqOpts = function() {
            plugin.reqOpts = new actuate.RequestOptions();
            plugin.reqOpts.setRepositoryType(options.repoType);
            plugin.reqOpts.setVolume(options.volume);
            plugin.reqOpts.setCustomParameters(options.customParams);
        };

        plugin.actInit = function() {
            actuate.initialize(options.iportal, options.reqOpts == undefined ? null : options.reqOpts, options.username, options.password, plugin.initReport);
        };

        plugin.initReport = function() {
            options.parameters = new actuate.Parameter(options.parameterID);
            options.parameters.setReportName(options.rptdesign);
            options.parameters.submit(function() {
                plugin.downloadParameterValues();
            });
        };

        plugin.downloadParameterValues = function() {
            var downloadedParameters = {
            };

            options.parameters.downloadParameters(function(vv) {
                var downloadedParameters = {};
                for(var i=0; i<vv.length; i++) {
                    var q = {
                        defaultValue: vv[i].getDefaultValue(),
                        names: new Array(),
                        values: new Array()
                    };
                    for(var j=0; j<vv[i].getSelectNameValueList().length; j++) {
                        var pair = vv[i].getSelectNameValueList();
                        q.names.push(pair[j].getName());
                        q.values.push(pair[j].getValue());
                    }
                    downloadedParameters[i] = q;
                }

                options.initCallback(downloadedParameters);
            });
        }

        plugin.performCascade = function(newValues) {
            options.parameters.downloadParameters(function(v){
                var zz = new Array();

                for(var key in newValues) {
                    var currentValue = newValues[key].value;

                    if(currentValue != null) {
                        var currentValue = v[key];
                        currentValue.setDefaultValue(newValues[key].value);
                        currentValue.setDefaultValueIsNull(false);
                        zz.push(currentValue);
                    }else{
                        var currentValue = v[key];
                        currentValue.setDefaultValue(null);
                        currentValue.setDefaultValueIsNull(true);
                        zz.push(currentValue);
                    }
                }

                options.parameters.overwriteParameterDefProperties(zz);

                var r = options.parameters.downloadParameters(function(nn) {
                    var s = options.parameters.renderContent(nn, function() {
                        options.parameterValues = plugin.downloadParameterValues();
                    });
                });
            });
        };

        plugin.init();

        plugin.downloadCascadingParameters = function(changedvalues) {
        };

        return this;
    };
}(jQuery));
