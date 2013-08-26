/**
    *   Initialize unobtrusive validation. (It parses html attributes to from's "validator" data object)
    *   @param {Object} selector Selector to form DOM node or any node inside form
	*   @param {Object} unobtrusive validation settings
    *   @param {Boolean} deletePreviousRules Delete any rules already attached to the form
    *   If deletePreviousRules parameter is set to true then it will delete already attached validation rules
    *   to the form. If its set to false it's possible to attach rules dynamically. Preference is given to already added rules.
    */
    $.validator.unobtrusive.initUnobtrusiveValidationForDynamicFormContent = function(selector, settings, deletePreviousRules) {
        var $form = $(selector).first().closest('form'),
            validator = $form.data('validator'),
            unobtrusiveValidation = $form.data('unobtrusiveValidation');

        if (deletePreviousRules && validator) {
            $.each(validator.settings.rules, function(elname, elrules) {
                delete validator.settings.rules[elname];
                delete unobtrusiveValidation.options.rules[elname];
            });
        }
        $.validator.unobtrusive.parse(selector);
        unobtrusiveValidation = $form.data('unobtrusiveValidation');
        validator = $form.validate();
        $.extend(validator.settings, settings);
        $.each(unobtrusiveValidation.options.rules, function(elname, elrules) {
            if (validator.settings.rules[elname] == undefined) {
                var args = $.extend({
                    messages: unobtrusiveValidation.options.messages[elname]
                }, elrules);
                $(selector).find("[name='" + elname + "']").rules("add", args);
            } else {
                $.each(elrules, function(rulename, data) {
                    if (validator.settings.rules[elname][rulename] == undefined) {
                        var args = {
                            messages: unobtrusiveValidation.options.messages[elname][rulename]
                        };
                        args[rulename] = data;
                        $(selector).find("[name='" + elname + "']").rules("add", args);
                    }
                });
            }
        });
    };