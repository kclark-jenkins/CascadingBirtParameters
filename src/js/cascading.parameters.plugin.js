(function ($) {
    $.CascadingBirtParameters = function (options) {

        var defaults = {
                report:          null,
                parametersDivID: null,
                designName: null,
                parameterInputMap: {
                    inputName: [],
                    parameterName: []
                }
            },
            plugin  = this,
            options = options || {};


        plugin.init = function () {
            actuate.load("parameter");
            var settings = $.extend({}, defaults, options);
            $.data(document, 'CascadingBirtParameters', settings);
        };

        plugin.init();

        plugin.downloadCascadingParameters = function() {
            $('#'+options.parametersDivID).hide();
            var map = {};

            var myParameters = new actuate.Parameter(options.parametersDivID);
                myParameters.setReportName(options.designName);

            try {
                myParameters.submit(function() {
                    myParameters.downloadParameters(function(test) {
                        var reportNameValuePair = new actuate.parameter.NameValuePair(test);
                        //console.log(reportNameValuePair);
                        for(i=0; i<reportNameValuePair.getName().length; i++) {
                            var obj = new Object(reportNameValuePair.getName()[i]['_']);

                            var nameValueList = {
                                    names: [],
                                    values: []
                            };

                            for(j=0; j<obj['_selectNameValueList'].length;j++){
                                var current = obj['_selectNameValueList'][j]['_'];
                                nameValueList.names.push(current['_name']);
                                nameValueList.values.push(current['_value']);
                            }


                            var currentObject = {
                                metadata: {
                                    cascadingParentName: obj['_cascadingParentName'],
                                    columnType: obj['_columnType'],
                                    controlType: obj['_controlType'],
                                    dataType: obj['_dataType'],
                                    defaultValue: obj['_defaultValue'],
                                    displayName: obj['_displayName'],
                                    group: obj['_group'],
                                    groupPromptText: obj['_groupPromptText'],
                                    helpText: obj['_helpText'],
                                    isAdHoc: obj['_isAdHoc'],
                                    isDynamicSelectionList: obj['_isDynamicSelectionList'],
                                    isHidden: obj['_isHidden'],
                                    isPassword: obj['_isPassword'],
                                    isRequired: obj['_isRequired']
                                },
                                currentValue: obj['_currentValue'],
                                currentName: obj['_currentName'],
                                nameValueList: nameValueList
                            };

                            map[obj['_name']] = currentObject;
                        }

                        for(var key in options.parameterInputMap) {
                            $('#'+options.parameterInputMap[key]).empty();
                        }

                        for(var key in map) {
                            var currentValue  = map[key]['currentValue'];
                            //var currentName   = map[key]
                            var nameValueList = map[key]['nameValueList'];
                            var metaData      = map[key]['metadata'];

                            for(i=0;i<nameValueList.names.length;i++){
                                //console.log(options.parameterInputMap[key]);
                                $('#'+options.parameterInputMap[key]).append($('<option>', {
                                    value: nameValueList.values[i],
                                    text: nameValueList.names[i]
                                }));
                            }

                            $('#'+options.parameterInputMap[key]).val(currentValue);
                        }
                    });
                });
            }catch(err){
                console.log(err);
            }
        };

        return this;
    };
}(jQuery));
