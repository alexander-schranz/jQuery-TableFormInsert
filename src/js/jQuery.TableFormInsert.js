/**
 * jQuery.TableFormInsert
 * Version 1.1
 */

(function($) {
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
                    selected = 'selected';
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
        table = '<table class="tfiTable ' + options.elementClass + '">' + tablehead + tablebody +'</table>';
        
        // Hide Textarea
        if ( options.hidetext ) {
            $( element ).hide();
        }
        
        // Show Table
        if ( options.container === '' ) {
            $(element).after(table);
        } else {
            $( options.container ).html( table );
        }
        
        // Add Event Listener: Type Changed
        $('.tfiTypeChanger').change(function() {
            if ($(this).val() === '') {
                $( '.tfiColumn-' + $(this).data('column')).find('.tfiInput').addClass('deactivatedColumn').not('.deactivatedRow').prop('disabled', true).parent().find('.tfiText').css(options.deactivateCSS);
                $(this).addClass('deactivated');
            } else {
                $( '.tfiColumn-' + $(this).data('column')).find('.tfiInput').removeClass('deactivatedColumn').not('.deactivatedRow').prop('disabled', false).parent().find('.tfiText').css(options.resetCSS);
                $(this).removeClass('deactivated');
            }
        });
        
        // Add Event Listener: Row Hide
        $('.tfiCheckbox').change(function() {
            if (!$(this).prop('checked')) {
                $( '.tfiRow-' + $(this).data('row')).find('.tfiInput').addClass('deactivatedRow').not('.deactivatedColumn').prop('disabled', true).parent().find('.tfiText').css(options.deactivateCSS);
                $(this).addClass('deactivated');
            } else {
                $( '.tfiRow-' + $(this).data('row')).find('.tfiInput').removeClass('deactivatedRow').not('.deactivatedColumn').prop('disabled', false).parent().find('.tfiText').css(options.resetCSS);
                $(this).removeClass('deactivated');
            }
        });
        
        options.callback(table);
    };

    /* Default Options */
    $.TFI.defaults = {
        breakRegex: /[\r\n]/,
        cellBreak: /[\t]/,
        select: [
        ],
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
        deactivateText: 'Not used',
        callback: function (table) {}
    };

})(jQuery);