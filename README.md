# CascadingBirtParameters

CascadingBirtParameters is a JQuery plugin for the Information Hub platform.  It is intended as an example of how to extend
the base functionality of the interactive viewer's JavaScript API, specifically cascading parameters.

This plugin takes a series of options, including a callback function that is executed after the initalization and when
calling $.cascadingBirtParameters.executeCascade();

This callback is user defined and takes one parameter for the function to work properley.

If setup correctly the user defined function will recieve an object containing all of the cascading parameter values
currently available based on the value map passed into it.

After getting the object in the callback it is up to the user to determine what needs to be done with the data.

# Example usage

```
        $(document).ready(function() {
            var cascadingParameters = $.cascadingBirtParameters({
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
                initCallback:  function(pValues) {
                    for(var keys in pValues) {
                        for(var i=0; i<pValues[keys].names.length; i++) {
                            $('#parameter'+keys).append(new Option(pValues[keys].names[i], pValues[keys].values[i]));
                        };
                        $('#parameter'+keys).val(pValues[keys].defaultValue);
                    }
                }
            });

            $('.parameterGroup1').change(function (){
                var changedID = $(this).attr('id');
                var newValues = {
                    0: {
                        value: null
                    },
                    1: {
                        value: null
                    }
                }

                if(changedID == 'parameter0') {
                    newValues['0'].value = $(this).val();
                    // do nothing beyond this parameter
                    // clear and execute
                    $('.parameterGroup1').empty();
                    cascadingParameters.performCascade(newValues);
                }else if(changedID == 'parameter1') {
                    newValues['0'].value = $('#parameter0').val();
                    newValues['1'].value = $(this).val();
                    // do nothing beyond this parameter
                    // do not clear because we're the last parameter
                    cascadingParameters.performCascade(newValues);
                }
            });
        });
```