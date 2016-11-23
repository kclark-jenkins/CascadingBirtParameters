(function ($) {
    $.CascadingBirtParameters = function (userOptions) {
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
            options = userOptions || {};


        plugin.init = function () {
            actuate.load("parameter");
            var settings = $.extend({}, defaults, options);
            $.data(document, 'CascadingBirtParameters', settings);
        };

        plugin.init();

        plugin.downloadCascadingParameters = function(changedvalues) {
            //$('#'+options.parametersDivID).hide();
            var map = {};

            var myParameters = new actuate.Parameter(options.parametersDivID);
                myParameters.setReportName(options.designName);

            myParameters.submit(function() {
                myParameters.downloadParameters(function(test) {
                    var reportNameValuePair = new actuate.parameter.NameValuePair(test);
                    for(i=0; i<reportNameValuePair.getName().length; i++) {
                        var obj = new Object(reportNameValuePair.getName()[i]['_']);

                        var nameValueList = {
                            names:  [],
                            values: []
                        };

                        for(j=0; j<obj['_selectNameValueList'].length;j++){
                            var current = obj['_selectNameValueList'][j]['_'];
                            nameValueList.names.push(current['_name']);
                            nameValueList.values.push(current['_value']);
                        }


                        map[obj['_name']] = {
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
                    }

                    for(var key1 in options.parameterInputMap) {
                        $('#'+options.parameterInputMap[key1]).empty();
                    }

                    for(var key2 in map) {
                        var parameterInput = $('#'+options.parameterInputMap[key2]);
                        var currentValue  = map[key2]['currentValue'];
                        var nameValueList1 = map[key2]['nameValueList'];
                        var metaData      = map[key2]['metadata'];

                        for(i=0;i<nameValueList1.names.length;i++){
                                parameterInput.append($('<option>', {
                                    value: nameValueList1.values[i],
                                    text: nameValueList1.names[i]
                                }
                            ));
                        }
                        if(changedvalues==null){
                            parameterInput.val(currentValue);
                        }else{
                            for(i=0; i<changedvalues.length;i++) {
                                $('#' + options.parameterInputMap[changedvalues[i]['_name']]).val(changedvalues[i]['_value']);
                            }
                        }
                    }
                });
            });
        };

        return this;
    };
}(jQuery));
