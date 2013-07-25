/**
 * jQuery.TableFormInsert
 * Version 1.1
 */

(function($) {

    var tfiTableNr = 1;

    $.fn.extend({
        tfi: function(options) {
            options = $.extend( {}, $.TFI.defaults, options );

            this.each(function() {
                new $.TFI(this,options);
            });
            return this;
        }
    });
    
    $.TFI = function( element, options ) {
        var table = '';
        var tablehead = '';
        var tablebody = '';
        var text = $(element).val();
        var lines = text.split(options.breakRegex);
        
        var maxCell = 0;

        // Remove Old Table
        if ( options.container === '' ) {
            if ($(element).next().hasClass('tfiTable')) {
                $(element).next().remove();
            }
        } else {
            $( options.container ).html( '' );
        }
        
        // Get Max Cells
        for ( var i = 0; i < lines.length; i++ ) {
            var cells = lines[i].split(options.cellBreak);
            if (cells.length > maxCell) {
                maxCell = cells.length;
            }
        }
        
        // Create TableHead
        tablehead = tablehead + '<tr>';
        for ( var x = 0; x < maxCell; x++ ) {
            if ( x === 0 ) {
                tablehead = tablehead + '<th></th>';
            }
            var selectOptions = '';
            for ( var i = 0; i < options.select.length; i++ ) {
                var selected = '';
                if (i === x) {
                    if ( options.preselect ) {
                        selected = 'selected';
                    }
                }
                selectOptions = selectOptions + '<option value="' + options.select[i][0] + '" ' + selected + '>' + options.select[i][1] + '</option>';
            }
            if ( selectOptions !== '' ) {
                var optionSplitter = '';
                if ( options.optionSplitter === true) {
                    optionSplitter = '<option value="">---</option>';
                }
                selectOptions = '<option value="">' + options.deactivateText + '</option>' + optionSplitter + selectOptions;
            }
            tablehead = tablehead + '<th><select class="tfiTypeChanger" name="tfiType[' + x +']" data-column="' + x +'">' + selectOptions +'</select></th>';
        }
        tablehead = tablehead + '</tr>';
        tablehead = '<thead>' + tablehead + '</thead>';
        
        // Create TableBody
        for ( var i = 0; i < lines.length; i++ ) {
            if ($.trim(lines[i]).length > 0) {
                var cells = lines[i].split(options.cellBreak);
                tablebody = tablebody + '<tr>';
                for ( var x = 0; x < maxCell; x++ ) {
                    if ( x === 0 ) {
                        tablebody = tablebody + '<td class="tfiCheckColumn"><input class="tfiCheckbox" type="checkbox" name="tfiRow[' + i + ']" data-row="' + i +'" checked></td>';
                    }
                    if (cells.length < maxCell) {
                        tablebody = tablebody + '<td></td>';
                    } else {
                        var input = '';
                        if ( options.changeable ) {
                            input = '<input class="tfiInput tfiText" type="text" name="tfiInput['+i+']['+x+']" value="' + cells[x] + '">';
                        } else {
                            input = '<input class="tfiInput" type="hidden" name="tfiInput['+i+']['+x+']" value="' + cells[x] + '"><span class="tfiText">' + cells[x] + '<span>';
                        }
                        tablebody = tablebody + '<td class="tfiColumn tfiColumn-' + x + ' tfiRow-' + i + '">' + input +'</td>';
                    }
                }
            }
            tablebody = tablebody + '</tr>';
        }
        tablebody = '<tbody>' + tablebody + '</tbody>';
        
        // Create Table
        table = '<table id="tfiTable-' + tfiTableNr + '" class="tfiTable ' + options.elementClass + '">' + tablehead + tablebody +'</table>';
        
        // Hide Textarea
        if ( options.hidetext ) {
            $( element ).hide();
        }
        
        // Show Table
        if ( options.container === '' ) {
            $(element).after( table );
        } else {
            $( options.container ).html( table );
        }

        // Set Inactive Fields
        var tfiTable;

        if ( options.container === '' ) {
            tfiTable = $(element).next();
        } else {
            tfiTable = $( options.container ).find('.tfiTable');
        }

        $(tfiTable).find('th select').each(function () {
            if ($(this).val() === '') {
                var columnClass = '.tfiColumn-' + $(this).data('column');
                $(this).closest('table').find(columnClass).find('.tfiInput').addClass('deactivatedColumn').not('.deactivatedRow').prop('disabled', true).parent().find('.tfiText').css(options.deactivateCSS);
                $(this).addClass('deactivated');
            }
        });
        
        // Add Event Listener: Type Changed
        $('.tfiTypeChanger').change(function() {
            if ($(this).val() === '') {
                $(this).closest('table').find( '.tfiColumn-' + $(this).data('column')).find('.tfiInput').addClass('deactivatedColumn').not('.deactivatedRow').prop('disabled', true).parent().find('.tfiText').css(options.deactivateCSS);
                $(this).addClass('deactivated');
            } else {
                $(this).closest('table').find( '.tfiColumn-' + $(this).data('column')).find('.tfiInput').removeClass('deactivatedColumn').not('.deactivatedRow').prop('disabled', false).parent().find('.tfiText').css(options.resetCSS);
                $(this).removeClass('deactivated');
            }
        });
        
        // Add Event Listener: Row Hide
        $('.tfiCheckbox').change(function() {
            if (!$(this).prop('checked')) {
                $(this).parent('table').find( '.tfiRow-' + $(this).data('row')).find('.tfiInput').addClass('deactivatedRow').not('.deactivatedColumn').prop('disabled', true).parent().find('.tfiText').css(options.deactivateCSS);
                $(this).addClass('deactivated');
            } else {
                $(this).parent('table').find( '.tfiRow-' + $(this).data('row')).find('.tfiInput').removeClass('deactivatedRow').not('.deactivatedColumn').prop('disabled', false).parent().find('.tfiText').css(options.resetCSS);
                $(this).removeClass('deactivated');
            }
        });

        // Validation
        if ( options.submitButton !== '' ) {
            var requiredFields = '';
            if ( options.requiredFields.length > 0 ) {
                for ( var i = 0; i < options.requiredFields.length; i++ ) {
                    var option = options.requiredFields[i];
                    var splitter = ',';
                    if ( requiredFields === '' ) {
                        splitter = '';
                    }
                    requiredFields = requiredFields + splitter + option;
                }
                $( '#tfiTable-' + tfiTableNr ).data('required', requiredFields);
                $( '#tfiTable-' + tfiTableNr ).data( 'message-box' , options.infoBox );
                $( options.submitButton).data( 'tfi-id' , '#tfiTable-' + tfiTableNr);
                $( options.submitButton ).click(function(event) {
                    var tableId = $( this ).data( 'tfi-id' );
                    var messageBox = $( tableId ).data( 'message-box' );
                    var errorMessage = 'Following Fields are required: ';
                    var errorFields = '';
                    var hasRequiredFields = true;
                    requiredFields = $( tableId ).data( 'required' ).split(',');
                    for ( var i = 0; i < requiredFields.length; i++ ) {
                        var hasRequiredField = false;

                        $( tableId ).find('th select').each(function() {
                            if ($(this).val() === requiredFields[i]) {
                                hasRequiredField = true;
                            }
                        });
                        if ( !hasRequiredField ) {
                            hasRequiredFields = false;
                            $( tableId ).find('th select').first().find('option').each(function () {
                                if ($(this).val() === requiredFields[i]) {
                                    var splitter = ', ';
                                    if (errorFields === '') {
                                        splitter = '';
                                    }
                                    errorFields = errorFields + splitter + $(this).html();
                                }
                            });
                        }
                    }
                    errorMessage = errorMessage + errorFields;

                    if ( !hasRequiredFields ) {
                        if ( messageBox !== '' ) {
                            $(messageBox).html( errorMessage );
                            $(messageBox).addClass('tfi-error');
                        } else {
                            if ( options.removeErrorText ) {
                                $(messageBox).html('');
                            }
                            $( messageBox ).removeClass('tfi-error');
                        }
                        event.preventDefault();
                    }
                });
            }
        }

        tfiTableNr++;
        
        options.callback(tfiTable);
    };

    /* Default Options */
    $.TFI.defaults = {
        breakRegex: /[\r\n]/,
        cellBreak: /[\t]/,
        select: [
        ],
        preselect: true,
        changeable: true,
        optionSplitter: true,
        hidetext: true,
        container: '',
        elementClass: '',
        deactivateCSS: {
            color: '#aaa'
        },
        resetCSS: {
            color: '#000'
        },
        submitButton: '',
        requiredFields: [
        ],
        infoBox: '',
        removeErrorText: false,
        deactivateText: 'Not used',
        callback: function (table) {}
    };

})(jQuery);