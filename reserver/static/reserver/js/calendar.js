/**
 * Bootstrap based calendar full view.
 *
 * https://github.com/Serhioromano/bootstrap-calendar
 *
 * User: Sergey Romanov <serg4172@mail.ru>
 */
 
 /* Notes added 28.09.2017
  * - Used under MIT license for NTNU, modified under the terms of that license by avn@471.no
  */
"use strict";

(function(){Date.shortMonths=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Date.longMonths=["January","February","March","April","May","June","July","August","September","October","November","December"],Date.shortDays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Date.longDays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var t={d:function(){var t=this.getDate();return(t<10?"0":"")+t},D:function(){return Date.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.longDays[this.getDay()]},N:function(){var t=this.getDay();return 0==t?7:t},S:function(){var t=this.getDate();return t%10==1&&11!=t?"st":t%10==2&&12!=t?"nd":t%10==3&&13!=t?"rd":"th"},w:function(){return this.getDay()},z:function(){var t=new Date(this.getFullYear(),0,1);return Math.ceil((this-t)/864e5)},W:function(){var t=new Date(this.valueOf()),e=(this.getDay()+6)%7;t.setDate(t.getDate()-e+3);var n=t.valueOf();t.setMonth(0,1),4!==t.getDay()&&t.setMonth(0,1+(4-t.getDay()+7)%7);var r=1+Math.ceil((n-t)/6048e5);return r<10?"0"+r:r},F:function(){return Date.longMonths[this.getMonth()]},m:function(){var t=this.getMonth();return(t<9?"0":"")+(t+1)},M:function(){return Date.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var t=this.getFullYear(),e=this.getMonth()+1;return 12===e&&(t=t++,e=0),new Date(t,e,0).getDate()},L:function(){var t=this.getFullYear();return t%400==0||t%100!=0&&t%4==0},o:function(){var t=new Date(this.valueOf());return t.setDate(t.getDate()-(this.getDay()+6)%7+3),t.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(1e3*((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){var t=this.getHours();return((t%12||12)<10?"0":"")+(t%12||12)},H:function(){var t=this.getHours();return(t<10?"0":"")+t},i:function(){var t=this.getMinutes();return(t<10?"0":"")+t},s:function(){var t=this.getSeconds();return(t<10?"0":"")+t},v:function(){var t=this.getMilliseconds();return(t<10?"00":t<100?"0":"")+t},e:function(){return Intl.DateTimeFormat().resolvedOptions().timeZone},I:function(){for(var t=null,e=0;e<12;++e){var n=new Date(this.getFullYear(),e,1).getTimezoneOffset();if(null===t)t=n;else{if(n<t){t=n;break}if(n>t)break}}return this.getTimezoneOffset()==t|0},O:function(){var t=this.getTimezoneOffset();return(-t<0?"-":"+")+(Math.abs(t/60)<10?"0":"")+Math.floor(Math.abs(t/60))+(0==Math.abs(t%60)?"00":(Math.abs(t%60)<10?"0":"")+Math.abs(t%60))},P:function(){var t=this.getTimezoneOffset();return(-t<0?"-":"+")+(Math.abs(t/60)<10?"0":"")+Math.floor(Math.abs(t/60))+":"+(0==Math.abs(t%60)?"00":(Math.abs(t%60)<10?"0":"")+Math.abs(t%60))},T:function(){var t=this.toLocaleTimeString(navigator.language,{timeZoneName:"short"}).split(" ");return t[t.length-1]},Z:function(){return 60*-this.getTimezoneOffset()},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}};Date.prototype.format=function(e){var n=this;return e.replace(/(\\?)(.)/g,function(e,r,a){return""===r&&t[a]?t[a].call(n):a})}}).call(this);

var weekend_tooltip = {
	title: "Only for 6+ day cruises.",
	placement: "left",
	container: '.cal-month-box'
}

function postpone(fun) {
    window.setTimeout(fun, 0);
}

var selected_count = 0;
var start_date = "";
var end_date = "";
var selected_dates = [];
var external_date = false;

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getDatesBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function update_cruise_day_dates() {
	if (selected_dates.length > 0) {
		$( ".cruiseDayForm:visible" ).each(function(i) {
			if (i < selected_dates.length) {
				$(this).find("[name*=is_long_day]").prop('checked', true);
				$(this).find("[placeholder=Date]").val(formatDate(selected_dates[i]));
				if ($(this).find("[name*=is_long_day]").is(":checked")) {
					var day_type_string = "Long day";
				} else {
					var day_type_string = "Short day";
				}
				$(this).find(".date-container").text(selected_dates[i].format("D jS \\o\\f F Y"));
				$(this).find(".day-type-container").text(day_type_string);
				$(this).find("[placeholder=Date]").closest(".form-group").hide();
			}
		});
		$(".cruise-days-header").show();
	}
}

function update_cruise_days(selected_dates) {
	while($(".cruiseDayForm:visible").length != selected_dates.length) {
		if ($(".cruiseDayForm:visible").length > selected_dates.length) {
			$(".cruiseDayForm:visible").last().find(".delete-row").click();
		} else {
			$(".add-cruise-day").click();
		}
	}
	console.log("updated cruise days");
	postpone(update_cruise_day_dates);
}

function render_selected_dates(cal_day_element, selected_dates) {
	$(cal_day_element).closest(".calendarContainer").find(".cal-month-day.selected-date").removeClass("selected-date");
	$(cal_day_element).closest(".calendarContainer").find(".in-range").removeClass("in-range");
	for(var i = 0; i < selected_dates.length; i++) {
		if (i == 0 || i == selected_dates.length - 1) {
			$(cal_day_element).closest(".calendar").find('[data-cal-date="' + formatDate(selected_dates[i]) + '"]').closest(".cal-month-day").addClass("selected-date");
			$(cal_day_element).closest(".calendar").find('[data-cal-date="' + formatDate(selected_dates[i]) + '"]').closest(".cal-month-day").addClass("in-range");
		} else {
			$(cal_day_element).closest(".calendar").find('[data-cal-date="' + formatDate(selected_dates[i]) + '"]').closest(".cal-month-day").addClass("in-range");
		}
	}
}

function update_range(cal_day_element, new_date) {
	selected_count++;
	if (selected_count > 2) {
		/* range is selected already - reset */
		selected_count = 1;
	}
	if (selected_count == 1) {
		if (external_date) {
			start_date = new_date;
			external_date = false;
		} else {
			start_date = new_date;
			end_date = new_date;
		}
		selected_dates = [new Date(new_date)];
	} else {
		var start_time = new Date(start_date).getTime();
		var end_time = new Date(start_date).getTime();
		var new_time = new Date(new_date).getTime();
		if (new_time <= start_time) {
			end_date = new_date;
		} else {
			end_date = start_date;
			start_date = new_date;
		}
		var start = new Date(end_date);
		var end = new Date(start_date);
		var currentDate = new Date(start.getTime());
		var between = [];

		while (currentDate.getTime() <= end.getTime()) {
			between.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		selected_dates = between;
	}
	
	var temp = start_date;
	start_date = end_date;
	end_date = temp;
	
	render_selected_dates(cal_day_element, selected_dates);
	if (document.querySelector(".cruiseDaysContainer")) {
		update_cruise_days(selected_dates);
		postpone(update_sum);
	}
	if (document.querySelector(".order-cruise-button")) {
		$(".order-cruise-button, .nav-order-button").attr("href", "/cruises/add/"+"from-"+formatDate(start_date)+"-to-"+formatDate(end_date));
		$(".order-cruise-button, .nav-order-button").text("Order this cruise");
	}
	if (document.querySelector(".add-event-button")) {
		$(".add-event-button, .nav-order-button").attr("href", "/admin/events/add/"+"from-"+formatDate(start_date)+"-to-"+formatDate(end_date));
		$(".add-event-button, .nav-order-button").text("Add this event");
	}
	if (document.querySelector(".show-invoice-summary-button")) {
		$(".show-invoice-summary-button, .nav-order-button").attr("href", "/invoices/history/"+"from-"+formatDate(start_date)+"-to-"+formatDate(end_date));
		$(".show-invoice-summary-button, .nav-order-button").text("Show invoice summary for this period");
	}
}

Date.prototype.getWeek = function(iso8601) {
	if (iso8601) {
		var target = new Date(this.valueOf());
		var dayNr  = (this.getDay() + 6) % 7;
		target.setDate(target.getDate() - dayNr + 3);
		var firstThursday = target.valueOf();
		target.setMonth(0, 1);
		if (target.getDay() != 4) {
			target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
		}
		
		var weekNumber =  1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000

		return weekNumber;
	} else {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
	}
};
Date.prototype.getMonthFormatted = function() {
	var month = this.getMonth() + 1;
	return month < 10 ? '0' + month : month;
};
Date.prototype.getDateFormatted = function() {
	var date = this.getDate();
	return date < 10 ? '0' + date : date;
};

if(!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}
if(!String.prototype.formatNum) {
	String.prototype.formatNum = function(decimal) {
		var r = "" + this;
		while(r.length < decimal)
			r = "0" + r;
		return r;
	};
}

(function($) {

	var defaults = {
		// Container to append the tooltip
		tooltip_container : 'body',
		// Width of the calendar
		width: '100%',
		// Initial view (can be 'month', 'week', 'day')
		view: 'month',
		// Initial date. No matter month, week or day this will be a starting point. Can be 'now' or a date in format 'yyyy-mm-dd'
		day: 'now',
		// Day Start time and end time with time intervals. Time split 10, 15 or 30.
		time_start: '06:00',
		time_end: '22:00',
		time_split: '30',
		// Source of events data. It can be one of the following:
		// - URL to return JSON list of events in special format.
		//   {success:1, result: [....]} or for error {success:0, error:'Something terrible happened'}
		//   events: [...] as described in events property description
		//   The start and end variables will be sent to this url
		// - A function that received the start and end date, and that
		//   returns an array of events (as described in events property description)
		// - An array containing the events
		events_source: '',
		// Static cache of events. If set to true, events will only be loaded once.
		// Useful if response is not constrained by date.
		events_cache: false,
		// Set format12 to true if you want to use 12 Hour format instead of 24 Hour
		format12: false,
		am_suffix: "AM",
		pm_suffix: "PM",
		// Path to templates should end with slash /. It can be as relative
		// /component/bootstrap-calendar/tmpls/
		// or absolute
		// http://localhost/component/bootstrap-calendar/tmpls/
		tmpl_path: '/static/reserver/tmpls/',
		tmpl_cache: true,
		classes: {
			months: {
				inmonth: 'cal-day-inmonth',
				outmonth: 'cal-day-outmonth',
				saturday: 'cal-day-weekend',
				sunday: 'cal-day-weekend',
				holidays: 'cal-day-holiday',
				today: 'cal-day-today'
			},
			week: {
				workday: 'cal-day-workday',
				saturday: 'cal-day-weekend',
				sunday: 'cal-day-weekend',
				holidays: 'cal-day-holiday',
				today: 'cal-day-today'
			}
		},
		// ID of the element of modal window. If set, events URLs will be opened in modal windows.
		modal: null,
		//	modal handling setting, one of "iframe", "ajax" or "template"
		modal_type: "iframe",
		//	function to set modal title, will be passed the event as a parameter
		modal_title: null,
		views: {
			year: {
				slide_events: 1,
				enable: 1
			},
			month: {
				slide_events: 1,
				enable: 1
			},
			week: {
				enable: 1
			},
			day: {
				enable: 1
			}
		},
		merge_holidays: false,
		display_week_numbers: true,
		weekbox: true,
		//shows events which fits between time_start and time_end
		show_events_which_fits_time: false,
		// Headers defined for ajax call
		headers: {},

		// ------------------------------------------------------------
		// CALLBACKS. Events triggered by calendar class. You can use
		// those to affect you UI
		// ------------------------------------------------------------
		onAfterEventsLoad: function(events) {
			// Inside this function 'this' is the calendar instance
		},
		onBeforeEventsLoad: function(next) {
			// Inside this function 'this' is the calendar instance
			next();
		},
		onAfterViewLoad: function(view) {
			// Inside this function 'this' is the calendar instance
		},
		onAfterModalShown: function(events) {
			// Inside this function 'this' is the calendar instance
		},
		onAfterModalHidden: function(events) {
			// Inside this function 'this' is the calendar instance
		},
		// -------------------------------------------------------------
		// INTERNAL USE ONLY. DO NOT ASSIGN IT WILL BE OVERRIDDEN ANYWAY
		// -------------------------------------------------------------
		events: [],
		templates: {
			year: '',
			month: '',
			week: '',
			day: ''
		},
		stop_cycling: false
	};

	var defaults_extended = {
		first_day: 2,
		week_numbers_iso_8601: false,
		holidays: {
			// January 1
			'01-01': "New Year's Day",
			// Third (+3*) Monday (1) in January (01)
			'01+3*1': "Birthday of Dr. Martin Luther King, Jr.",
			// Third (+3*) Monday (1) in February (02)
			'02+3*1': "Washington's Birthday",
			// Last (-1*) Monday (1) in May (05)
			'05-1*1': "Memorial Day",
			// July 4
			'04-07': "Independence Day",
			// First (+1*) Monday (1) in September (09)
			'09+1*1': "Labor Day",
			// Second (+2*) Monday (1) in October (10)
			'10+2*1': "Columbus Day",
			// November 11
			'11-11': "Veterans Day",
			// Fourth (+4*) Thursday (4) in November (11)
			'11+4*4': "Thanksgiving Day",
			// December 25
			'25-12': "Christmas"
		}
	};

	var strings = {
		error_noview: 'Calendar: View {0} not found',
		error_dateformat: 'Calendar: Wrong date format {0}. Should be either "now" or "yyyy-mm-dd"',
		error_loadurl: 'Calendar: Event URL is not set',
		error_where: 'Calendar: Wrong navigation direction {0}. Can be only "next" or "prev" or "today"',
		error_timedevide: 'Calendar: Time split parameter should divide 60 without decimals. Something like 10, 15, 30',

		no_events_in_day: 'No events in this day.',

		title_year: '{0}',
		title_month: '{0} {1}',
		title_week: 'week {0} of {1}',
		title_day: '{0} {1} {2}, {3}',

		week: 'Week {0}',
		all_day: 'All day',
		time: 'Time',
		events: 'Events',
		before_time: 'Ends before timeline',
		after_time: 'Starts after timeline',

		m0: 'January',
		m1: 'February',
		m2: 'March',
		m3: 'April',
		m4: 'May',
		m5: 'June',
		m6: 'July',
		m7: 'August',
		m8: 'September',
		m9: 'October',
		m10: 'November',
		m11: 'December',

		ms0: 'Jan',
		ms1: 'Feb',
		ms2: 'Mar',
		ms3: 'Apr',
		ms4: 'May',
		ms5: 'Jun',
		ms6: 'Jul',
		ms7: 'Aug',
		ms8: 'Sep',
		ms9: 'Oct',
		ms10: 'Nov',
		ms11: 'Dec',

		d0: 'Sunday',
		d1: 'Monday',
		d2: 'Tuesday',
		d3: 'Wednesday',
		d4: 'Thursday',
		d5: 'Friday',
		d6: 'Saturday'
	};

	var browser_timezone = '';
	try {
		if($.type(window.jstz) == 'object' && $.type(jstz.determine) == 'function') {
			browser_timezone = jstz.determine().name();
			if($.type(browser_timezone) !== 'string') {
				browser_timezone = '';
			}
		}
	}
	catch(e) {
	}

	function buildEventsUrl(events_url, data) {
		var separator, key, url;
		url = events_url;
		separator = (events_url.indexOf('?') < 0) ? '?' : '&';
		for(key in data) {
			url += separator + key + '=' + encodeURIComponent(data[key]);
			separator = '&';
		}
		return url;
	}

	function getExtentedOption(cal, option_name) {
		var fromOptions = (cal.options[option_name] != null) ? cal.options[option_name] : null;
		var fromLanguage = (cal.locale[option_name] != null) ? cal.locale[option_name] : null;
		if((option_name == 'holidays') && cal.options.merge_holidays) {
			var holidays = {};
			$.extend(true, holidays, fromLanguage ? fromLanguage : defaults_extended.holidays);
			if(fromOptions) {
				$.extend(true, holidays, fromOptions);
			}
			return holidays;
		}
		else {
			if(fromOptions != null) {
				return fromOptions;
			}
			if(fromLanguage != null) {
				return fromLanguage;
			}
			return defaults_extended[option_name];
		}
	}

	function getHolidays(cal, year) {
		var hash = [];
		var holidays_def = getExtentedOption(cal, 'holidays');
		for(var k in holidays_def) {
			hash.push(k + ':' + holidays_def[k]);
		}
		hash.push(year);
		hash = hash.join('|');
		if(hash in getHolidays.cache) {
			return getHolidays.cache[hash];
		}
		var holidays = [];
		$.each(holidays_def, function(key, name) {
			var firstDay = null, lastDay = null, failed = false;
			$.each(key.split('>'), function(i, chunk) {
				var m, date = null;
				if(m = /^(\d\d)-(\d\d)$/.exec(chunk)) {
					date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
				}
				else if(m = /^(\d\d)-(\d\d)-(\d\d\d\d)$/.exec(chunk)) {
					if(parseInt(m[3], 10) == year) {
						date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
					}
				}
				else if(m = /^easter(([+\-])(\d+))?$/.exec(chunk)) {
					date = getEasterDate(year, m[1] ? parseInt(m[1], 10) : 0);
				}
				else if(m = /^(\d\d)([+\-])([1-5])\*([0-6])$/.exec(chunk)) {
					var month = parseInt(m[1], 10) - 1;
					var direction = m[2];
					var offset = parseInt(m[3]);
					var weekday = parseInt(m[4]);
					switch(direction) {
						case '+':
							var d = new Date(year, month, 1 - 7);
							while(d.getDay() != weekday) {
								d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
							}
							date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * offset);
							break;
						case '-':
							var d = new Date(year, month + 1, 0 + 7);
							while(d.getDay() != weekday) {
								d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
							}
							date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7 * offset);
							break;
					}
				}
				if(!date) {
					warn('Unknown holiday: ' + key);
					failed = true;
					return false;
				}
				switch(i) {
					case 0:
						firstDay = date;
						break;
					case 1:
						if(date.getTime() <= firstDay.getTime()) {
							warn('Unknown holiday: ' + key);
							failed = true;
							return false;
						}
						lastDay = date;
						break;
					default:
						warn('Unknown holiday: ' + key);
						failed = true;
						return false;
				}
			});
			if(!failed) {
				var days = [];
				if(lastDay) {
					for(var date = new Date(firstDay.getTime()); date.getTime() <= lastDay.getTime(); date.setDate(date.getDate() + 1)) {
						days.push(new Date(date.getTime()));
					}
				}
				else {
					days.push(firstDay);
				}
				holidays.push({name: name, days: days});
			}
		});
		getHolidays.cache[hash] = holidays;
		return getHolidays.cache[hash];
	}

	getHolidays.cache = {};

	function warn(message) {
		if($.type(window.console) == 'object' && $.type(window.console.warn) == 'function') {
			window.console.warn('[Bootstrap-Calendar] ' + message);
		}
	}

	function Calendar(params, context) {
		this.options = $.extend(true, {position: {start: new Date(), end: new Date()}}, defaults, params);
		this.setLanguage(this.options.language);
		this.context = context;

		context.css('width', this.options.width).addClass('cal-context');

		this.view();
		return this;
	}

	Calendar.prototype.setOptions = function(object) {
		$.extend(this.options, object);
		if('language' in object) {
			this.setLanguage(object.language);
		}
		if('modal' in object) {
			this._update_modal();
		}
	}

	Calendar.prototype.setLanguage = function(lang) {
		if(window.calendar_languages && (lang in window.calendar_languages)) {
			this.locale = $.extend(true, {}, strings, calendar_languages[lang]);
			this.options.language = lang;
		} else {
			this.locale = strings;
			delete this.options.language;
		}
	}

	Calendar.prototype._render = function() {
		this.context.html('');
		this._loadTemplate(this.options.view);
		this.stop_cycling = false;

		var data = {};
		data.cal = this;
		data.day = 1;

		// Getting list of days in a week in correct order. Works for month and week views
		if(getExtentedOption(this, 'first_day') == 1) {
			data.days_name = [this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6, this.locale.d0]
		} else {
			data.days_name = [this.locale.d0, this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6]
		}

		// Get all events between start and end
		var start = parseInt(this.options.position.start.getTime());
		var end = parseInt(this.options.position.end.getTime());

		data.events = this.getEventsBetween(start, end);

		switch(this.options.view) {
			case 'month':
				break;
			case 'week':
				this._calculate_hour_minutes(data);
				break;
			case 'day':
				this._calculate_hour_minutes(data);
				break;
		}

		data.start = new Date(this.options.position.start.getTime());
		data.lang = this.locale;

		this.context.append(this.options.templates[this.options.view](data));
		this._update();
	};

	Calendar.prototype._format_hour = function(str_hour) {
		var hour_split = str_hour.split(":");
		var hour = parseInt(hour_split[0]);
		var minutes = parseInt(hour_split[1]);

		var suffix = '';

		if(this.options.format12) {
			if(hour < 12) {
				suffix = this.options.am_suffix;
			}
			else {
				suffix = this.options.pm_suffix;
			}

			hour = hour % 12;
			if(hour == 0) {
				hour = 12;
			}
		}

		return hour.toString().formatNum(2) + ':' + minutes.toString().formatNum(2) + suffix;
	};

	Calendar.prototype._format_time = function(datetime) {
		return this._format_hour(datetime.getHours() + ':' + datetime.getMinutes());
	};

	Calendar.prototype._calculate_hour_minutes = function(data) {
		var $self = this;
		var time_split = parseInt(this.options.time_split);
		var time_split_count = 60 / time_split;
		var time_split_hour = Math.min(time_split_count, 1);

		if(((time_split_count >= 1) && (time_split_count % 1 != 0)) || ((time_split_count < 1) && (1440 / time_split % 1 != 0))) {
			$.error(this.locale.error_timedevide);
		}

		var time_start = this.options.time_start.split(":");
		var time_end = this.options.time_end.split(":");

		data.hours = (parseInt(time_end[0]) - parseInt(time_start[0])) * time_split_hour;
		var lines = data.hours * time_split_count - parseInt(time_start[1]) / time_split;
		var ms_per_line = (60000 * time_split);

		var start = new Date(this.options.position.start.getTime());
		start.setHours(time_start[0]);
		start.setMinutes(time_start[1]);
		var end = new Date(this.options.position.end.getTime()-(86400000));
		end.setHours(time_end[0]);
		end.setMinutes(time_end[1]);

		data.all_day = [];
		data.by_hour = [];
		data.after_time = [];
		data.before_time = [];
		$.each(data.events, function(k, e) {
			var s = new Date(parseInt(e.start));
			var f = new Date(parseInt(e.end));

			e.start_hour = $self._format_time(s);
			e.end_hour = $self._format_time(f);

			if(e.start < start.getTime()) {
				warn(1);
				e.start_hour = s.getDate() + ' ' + $self.locale['ms' + s.getMonth()] + ' ' + e.start_hour;
			}

			if(e.end > end.getTime()) {
				warn(1);
				e.end_hour = f.getDate() + ' ' + $self.locale['ms' + f.getMonth()] + ' ' + e.end_hour;
			}

			if(!$self.options.show_events_which_fits_time) {
				if(e.start <= start.getTime() && e.end >= end.getTime()) {
					data.all_day.push(e);
					return;
				}

				if(e.end < start.getTime()) {
					data.before_time.push(e);
					return;
				}

				if(e.start > end.getTime()) {
					data.after_time.push(e);
					return;
				}
			} else {
				if(e.start < start.getTime()) {
					data.before_time.push(e);
					return;
				}

				if(e.end > end.getTime()) {
					data.after_time.push(e);
					return;
				}

				if(e.start < start.getTime() && e.end < end.getTime()) {
					data.all_day.push(e);
					return;
				}
			}

			var event_start = start.getTime() - e.start;

			if(event_start >= 0) {
				e.top = 0;
			} else {
				e.top = Math.abs(event_start) / ms_per_line;
			}

			var lines_left = Math.abs(lines - e.top);
			var lines_in_event = (e.end - e.start) / ms_per_line;
			if(event_start >= 0) {
				lines_in_event = (e.end - start.getTime()) / ms_per_line;
			}

			e.lines = lines_in_event;
			if(lines_in_event > lines_left) {
				e.lines = lines_left;
			}

			data.by_hour.push(e);
		});
	};

	Calendar.prototype._hour_min = function(hour) {
		var time_start = this.options.time_start.split(":");
		var time_split = parseInt(this.options.time_split);
		var in_hour = 60 / time_split;
		return (hour == 0) ? (in_hour - (parseInt(time_start[1]) / time_split)) : in_hour;
	};

	Calendar.prototype._hour = function(hour, part) {
		var time_start = this.options.time_start.split(":");
		var time_split = parseInt(this.options.time_split);
		var h = "" + (parseInt(time_start[0]) + hour * Math.max(time_split / 60, 1));
		var m = "" + time_split * part;

		return this._format_hour(h.formatNum(2) + ":" + m.formatNum(2));
	};

	Calendar.prototype._week = function(event) {
		this._loadTemplate('week-days');

		var t = {};
		var start = parseInt(this.options.position.start.getTime());
		var end = parseInt(this.options.position.end.getTime());
		var events = [];
		var self = this;
		var first_day = getExtentedOption(this, 'first_day');

		$.each(this.getEventsBetween(start, end), function(k, event) {
			var eventStart  = new Date(parseInt(event.start));
			eventStart.setHours(0,0,0,0);
			var eventEnd    = new Date(parseInt(event.end));

			event.start_day = new Date(parseInt(eventStart.getTime())).getDay();
			if(first_day == 1) {
				event.start_day = (event.start_day + 6) % 7;
			}
			if((eventEnd.getTime() - eventStart.getTime()) <= 86400000) {
				event.days = 1;
			} else {
				event.days = ((eventEnd.getTime() - eventStart.getTime()) / 86400000);
			}

			if(eventStart.getTime() < start) {

				event.days = event.days - ((start - eventStart.getTime()) / 86400000);
				event.start_day = 0;
			}

			event.days = Math.ceil(event.days);

			if(event.start_day + event.days > 7) {
				event.days = 7 - (event.start_day);
			}

			events.push(event);
		});
		t.events = events;
		t.cal = this;
		return self.options.templates['week-days'](t);
	}

	Calendar.prototype._month = function(month) {
		this._loadTemplate('year-month');

		var t = {cal: this};
		var newmonth = month + 1;
		t.data_day = this.options.position.start.getFullYear() + '-' + (newmonth < 10 ? '0' + newmonth : newmonth) + '-' + '01';
		t.month_name = this.locale['m' + month];

		var curdate = new Date(this.options.position.start.getFullYear(), month, 1, 0, 0, 0);
		t.start = parseInt(curdate.getTime());
		t.end = parseInt(new Date(this.options.position.start.getFullYear(), month + 1, 1, 0, 0, 0).getTime());
		t.events = this.getEventsBetween(t.start, t.end);
		return this.options.templates['year-month'](t);
	}

	Calendar.prototype._day = function(week, day) {
		this._loadTemplate('month-day');

		var t = {tooltip: '', cal: this};
		var cls = this.options.classes.months.outmonth;

		var firstday = this.options.position.start.getDay();
		if(getExtentedOption(this, 'first_day') == 2) {
			firstday++;
		} else {
			firstday = (firstday == 0 ? 7 : firstday);
		}

		day = (day - firstday) + 1;
		var curdate = new Date(this.options.position.start.getFullYear(), this.options.position.start.getMonth(), day, 0, 0, 0);

		// if day of the current month
		if(day > 0) {
			cls = this.options.classes.months.inmonth;
		}
		// stop cycling table rows;
		var daysinmonth = (new Date(this.options.position.end.getTime() - 1)).getDate();
		if((day + 1) > daysinmonth) {
			this.stop_cycling = true;
		}
		// if day of the next month
		if(day > daysinmonth) {
			day = day - daysinmonth;
			cls = this.options.classes.months.outmonth;
		}

		cls = $.trim(cls + " " + this._getDayClass("months", curdate));

		if(day <= 0) {
			var daysinprevmonth = (new Date(this.options.position.start.getFullYear(), this.options.position.start.getMonth(), 0)).getDate();
			day = daysinprevmonth - Math.abs(day);
			cls += ' cal-month-first-row';
		}

		var holiday = this._getHoliday(curdate);
		if(holiday !== false) {
			t.tooltip = holiday;
		}

		t.data_day = curdate.getFullYear() + '-' + curdate.getMonthFormatted() + '-' + (day < 10 ? '0' + day : day);
		t.cls = cls;
		t.day = day;

		t.start = parseInt(curdate.getTime());
		t.end = parseInt(t.start + 86400000);
		t.events = this.getEventsBetween(t.start, t.end);
		return this.options.templates['month-day'](t);
	}

	Calendar.prototype._getHoliday = function(date) {
		var result = false;
		$.each(getHolidays(this, date.getFullYear()), function() {
			var found = false;
			$.each(this.days, function() {
				if(this.toDateString() == date.toDateString()) {
					found = true;
					return false;
				}
			});
			if(found) {
				result = this.name;
				return false;
			}
		});
		return result;
	};

	Calendar.prototype._getHolidayName = function(date) {
		var holiday = this._getHoliday(date);
		return (holiday === false) ? "" : holiday;
	};

	Calendar.prototype._getDayClass = function(class_group, date) {
		var self = this;
		var addClass = function(which, to) {
			var cls;
			cls = (self.options.classes && (class_group in self.options.classes) && (which in self.options.classes[class_group])) ? self.options.classes[class_group][which] : "";
			if((typeof(cls) == "string") && cls.length) {
				to.push(cls);
			}
		};
		var classes = [];
		if(date.toDateString() == (new Date()).toDateString()) {
			addClass("today", classes);
		}
		var holiday = this._getHoliday(date);
		if(holiday !== false) {
			addClass("holidays", classes);
		}
		switch(date.getDay()) {
			case 0:
				addClass("sunday", classes);
				break;
			case 6:
				addClass("saturday", classes);
				break;
		}

		addClass(date.toDateString(), classes);

		return classes.join(" ");
	};

	Calendar.prototype.view = function(view) {
		if(view) {
			if(!this.options.views[view].enable) {
				return;
			}
			this.options.view = view;
		}

		this._init_position();
		this._loadEvents();
		this._render();

		this.options.onAfterViewLoad.call(this, this.options.view);
	};

	Calendar.prototype.navigate = function(where, next) {
		var to = $.extend({}, this.options.position);
		if(where == 'next') {
			switch(this.options.view) {
				case 'year':
					to.start.setFullYear(this.options.position.start.getFullYear() + 1);
					break;
				case 'month':
					to.start.setMonth(this.options.position.start.getMonth() + 1);
					break;
				case 'week':
					to.start.setDate(this.options.position.start.getDate() + 7);
					break;
				case 'day':
					to.start.setDate(this.options.position.start.getDate() + 1);
					break;
			}
		} else if(where == 'prev') {
			switch(this.options.view) {
				case 'year':
					to.start.setFullYear(this.options.position.start.getFullYear() - 1);
					break;
				case 'month':
					to.start.setMonth(this.options.position.start.getMonth() - 1);
					break;
				case 'week':
					to.start.setDate(this.options.position.start.getDate() - 7);
					break;
				case 'day':
					to.start.setDate(this.options.position.start.getDate() - 1);
					break;
			}
		} else if(where == 'today') {
			to.start.setTime(new Date().getTime());
		} else if ((/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).test(where)) {
			to.start.setTime(new Date(where).getTime());
			console.log(new Date(where).getTime());
		}
		else {
			$.error(this.locale.error_where.format(where))
		}
		this.options.day = to.start.getFullYear() + '-' + to.start.getMonthFormatted() + '-' + to.start.getDateFormatted();
		this.view();
		if(_.isFunction(next)) {
			next();
		}
	};

	Calendar.prototype._init_position = function() {
		var year, month, day;

		if(this.options.day == 'now') {
			var date = new Date();
			year = date.getFullYear();
			month = date.getMonth();
			day = date.getDate();
		} else if(this.options.day.match(/^\d{4}-\d{2}-\d{2}$/g)) {
			var list = this.options.day.split('-');
			year = parseInt(list[0], 10);
			month = parseInt(list[1], 10) - 1;
			day = parseInt(list[2], 10);
		}
		else {
			$.error(this.locale.error_dateformat.format(this.options.day));
		}

		switch(this.options.view) {
			case 'year':
				this.options.position.start.setTime(new Date(year, 0, 1).getTime());
				this.options.position.end.setTime(new Date(year + 1, 0, 1).getTime());
				break;
			case 'month':
				this.options.position.start.setTime(new Date(year, month, 1).getTime());
				this.options.position.end.setTime(new Date(year, month + 1, 1).getTime());
				break;
			case 'day':
				this.options.position.start.setTime(new Date(year, month, day).getTime());
				this.options.position.end.setTime(new Date(year, month, day + 1).getTime());
				break;
			case 'week':
				var curr = new Date(year, month, day);
				var first;
				if(getExtentedOption(this, 'first_day') == 1) {
					first = curr.getDate() - ((curr.getDay() + 6) % 7);
				}
				else {
					first = curr.getDate() - curr.getDay();
				}
				this.options.position.start.setTime(new Date(year, month, first).getTime());
				this.options.position.end.setTime(new Date(year, month, first + 7).getTime());
				break;
			default:
				$.error(this.locale.error_noview.format(this.options.view))
		}
		return this;
	};

	Calendar.prototype.getTitle = function() {
		var p = this.options.position.start;
		switch(this.options.view) {
			case 'year':
				return this.locale.title_year.format(p.getFullYear());
				break;
			case 'month':
				return this.locale.title_month.format(this.locale['m' + p.getMonth()], p.getFullYear());
				break;
			case 'week':
				return this.locale.title_week.format(p.getWeek(getExtentedOption(this, 'week_numbers_iso_8601')), p.getFullYear());
				break;
			case 'day':
				return this.locale.title_day.format(this.locale['d' + p.getDay()], p.getDate(), this.locale['m' + p.getMonth()], p.getFullYear());
				break;
		}
		return;
	};

	Calendar.prototype.getYear = function() {
		var p = this.options.position.start;
		return p.getFullYear();
	};

	Calendar.prototype.getMonth = function() {
		var p = this.options.position.start;
		return this.locale['m' + p.getMonth()];
	};

	Calendar.prototype.getDay = function() {
		var p = this.options.position.start;
		return this.locale['d' + p.getDay()];
	};

	Calendar.prototype.isToday = function() {
		var now = new Date().getTime();

		return ((now > this.options.position.start) && (now < this.options.position.end));
	}

	Calendar.prototype.getStartDate = function() {
		return this.options.position.start;
	}

	Calendar.prototype.getEndDate = function() {
		return this.options.position.end;
	}

	Calendar.prototype._loadEvents = function() {
		var self = this;
		var source = null;
		if('events_source' in this.options && this.options.events_source !== '') {
			source = this.options.events_source;
		}
		else if('events_url' in this.options) {
			source = this.options.events_url;
			warn('The events_url option is DEPRECATED and it will be REMOVED in near future. Please use events_source instead.');
		}
		var loader;
		switch($.type(source)) {
			case 'function':
				loader = function() {
					return source(self.options.position.start, self.options.position.end, browser_timezone);
				};
				break;
			case 'array':
				loader = function() {
					return [].concat(source);
				};
				break;
			case 'string':
				if(source.length) {
					loader = function() {
						var events = [];
						var d_from = self.options.position.start;
						var d_to = self.options.position.end;
						var params = {from: d_from.getTime(), to: d_to.getTime(), utc_offset_from: d_from.getTimezoneOffset(), utc_offset_to: d_to.getTimezoneOffset()};

						if(browser_timezone.length) {
							params.browser_timezone = browser_timezone;
						}
						$.ajax({
							url: buildEventsUrl(source, params),
							dataType: 'json',
							type: 'GET',
							async: false,
							headers: self.options.headers,
						}).success(function(json) {
							json = JSON.parse(json);
							if(json.success != 1) {
								$.error(json.error);
							}
							if(json.result) {
								events = json.result;
							}
						});
						return events;
					};
				}
				break;
		}
		if(!loader) {
			$.error(this.locale.error_loadurl);
		}
		this.options.onBeforeEventsLoad.call(this, function() {
			if (!self.options.events.length || !self.options.events_cache) {
				self.options.events = loader();
				self.options.events.sort(function (a, b) {
					var delta;
					delta = a.start - b.start;
					if (delta == 0) {
						delta = a.end - b.end;
					}
					return delta;
				});
			}
			self.options.onAfterEventsLoad.call(self, self.options.events);
		});
	};

	Calendar.prototype._templatePath = function(name) {
		if(typeof this.options.tmpl_path == 'function') {
			return this.options.tmpl_path(name)
		}
		else {
			return this.options.tmpl_path + name + '.html';
		}
	};

	Calendar.prototype._loadTemplate = function(name) {
		if(this.options.templates[name]) {
			return;
		}
		var self = this;
		$.ajax({
			url: self._templatePath(name),
			dataType: 'html',
			type: 'GET',
			async: false,
			cache: this.options.tmpl_cache
		}).done(function(html) {
			self.options.templates[name] = _.template(html);
		});
	};

	Calendar.prototype._update = function() {
		var self = this;

		$('*[data-toggle="tooltip"]').tooltip({container: this.options.tooltip_container});

		$('*[data-cal-date]').click(function() {
			var view = $(this).data('cal-view');
			self.options.day = $(this).data('cal-date');
			self.view(view);
		});
		$('.cal-cell').click(function() {
			var view = $('[data-cal-date]', this).data('cal-view');
			self.options.day = $('[data-cal-date]', this).data('cal-date');
			self.view(view);
		});

		this['_update_' + this.options.view]();

		this._update_modal();

	};

	Calendar.prototype._update_modal = function() {
		var self = this;

		$('a[data-event-id]', this.context).unbind('click');

		if(!self.options.modal) {
			return;
		}

		var modal = $(self.options.modal);

		if(!modal.length) {
			return;
		}

		var ifrm = null;
		if(self.options.modal_type == "iframe") {
			ifrm = $(document.createElement("iframe"))
				.attr({
					width: "100%",
					frameborder: "0"
				});
		}

		$('a[data-event-id]', this.context).on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var url = $(this).attr('href');
			var id = $(this).data("event-id");
			var event = _.find(self.options.events, function(event) {
				return event.id == id
			});

			if(self.options.modal_type == "iframe") {
				ifrm.attr('src', url);
				$('.modal-body', modal).html(ifrm);
			}

			if(!modal.data('handled.bootstrap-calendar') || (modal.data('handled.bootstrap-calendar') && modal.data('handled.event-id') != event.id)) {
				modal.off('show.bs.modal')
					.off('shown.bs.modal')
					.off('hidden.bs.modal')
					.on('show.bs.modal', function() {
						var modal_body = $(this).find('.modal-body');
						switch(self.options.modal_type) {
							case "iframe":
								var height = modal_body.height() - parseInt(modal_body.css('padding-top'), 10) - parseInt(modal_body.css('padding-bottom'), 10);
								$(this).find('iframe').height(Math.max(height, 50));
								break;

							case "ajax":
								$.ajax({
									url: url, dataType: "html", async: false, success: function(data) {
										modal_body.html(data);
									}
								});
								break;

							case "template":
								self._loadTemplate("modal");
								//	also serve calendar instance to underscore template to be able to access current language strings
								modal_body.html(self.options.templates["modal"]({"event": event, "calendar": self}))
								break;
						}

						//	set the title of the bootstrap modal
						if(_.isFunction(self.options.modal_title)) {
							modal.find(".modal-header h3").html(self.options.modal_title(event));
						}
					})
					.on('shown.bs.modal', function() {
						self.options.onAfterModalShown.call(self, self.options.events);
					})
					.on('hidden.bs.modal', function() {
						self.options.onAfterModalHidden.call(self, self.options.events);
					})
					.data('handled.bootstrap-calendar', true).data('handled.event-id', event.id);
			}
			modal.modal('show');
		});
	};

	Calendar.prototype._update_day = function() {
		$('#cal-day-panel').height($('#cal-day-panel-hour').height());
	};

	Calendar.prototype._update_week = function() {
	};

	Calendar.prototype._update_year = function() {
		this._update_month_year();
	};

	Calendar.prototype._update_month = function() {
		this._update_month_year();

		var self = this;

		if(this.options.weekbox == true) {
			var week = $(document.createElement('div')).attr('id', 'cal-week-box');
			var start = this.options.position.start.getFullYear() + '-' + this.options.position.start.getMonthFormatted() + '-';
			self.context.find('.cal-month-box .cal-row-fluid')
				.on('mouseenter', function() {
					var p = new Date(self.options.position.start);
					var child = $('.cal-cell1:first-child .cal-month-day', this);
					var day = (child.hasClass('cal-month-first-row') ? 1 : $('[data-cal-date]', child).text());
					p.setDate(parseInt(day));
					day = (day < 10 ? '0' + day : day);
					week.html(self.locale.week.format(self.options.display_week_numbers == true ? p.getWeek(getExtentedOption(self, 'week_numbers_iso_8601')) : ''));
					week.attr('data-cal-week', start + day).show().appendTo(child);
				})
				.on('mouseleave', function() {
					week.hide();
				});

			week.click(function() {
				self.options.day = $(this).data('cal-week');
				self.view('week');
			});
		}


		self.context.find('a.event').mouseenter(function() {
			$('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-' + $(this).data('event-class'));
		});
		self.context.find('a.event').mouseleave(function() {
			$('div.cal-cell1').removeClass('day-highlight dh-' + $(this).data('event-class'));
		});
	};

	Calendar.prototype._update_month_year = function() {
		if(!this.options.views[this.options.view].slide_events) {
			return;
		}
		var self = this;
		var activecell = 0;
		var downbox = $(document.createElement('div')).attr('id', 'cal-day-tick').html('<i class="icon-chevron-down glyphicon glyphicon-chevron-down"></i>');

		self.context.find('.cal-month-day, .cal-year-box .span3')
			.on('mouseenter', function() {
				if($('.events-list', this).length == 0) {
					return;
				}
				if($(this).children('[data-cal-date]').text() == self.activecell) {
					return;
				}
				downbox.show().appendTo(this);
			})
			.on('mouseleave', function() {
				downbox.hide();
			})
			.on('click', function(event) {
				if($('.events-list', this).length == 0) {
					return;
				}
				if($(this).children('[data-cal-date]').text() == self.activecell) {
					return;
				}
				showEventsList(event, downbox, slider, self);
			})
		;

		var slider = $(document.createElement('div')).attr('id', 'cal-slide-box');
		slider.hide().click(function(event) {
			event.stopPropagation();
		});

		this._loadTemplate('events-list');

		downbox.click(function(event) {
			showEventsList(event, $(this), slider, self);
		});
	};

	Calendar.prototype.getEventsBetween = function(start, end) {
		var events = [];
		$.each(this.options.events, function() {
			if(this.start == null) {
				return true;
			}
			var event_end = this.end || this.start;
			if((parseInt(this.start) < end) && (parseInt(event_end) > start)) {
				events.push(this);
			}
		});
		return events;
	};

	function showEventsList(event, that, slider, self) {

		event.stopPropagation();

		var that = $(that);
		var cell = that.closest('.cal-cell');
		var row = cell.closest('.cal-before-eventlist');
		var tick_position = cell.data('cal-row');

		that.fadeOut('fast');

		slider.slideUp('fast', function() {
			var event_list = $('.events-list', cell);
			slider.html(self.options.templates['events-list']({
				cal: self,
				events: self.getEventsBetween(parseInt(event_list.data('cal-start')), parseInt(event_list.data('cal-end')))
			}));
			row.after(slider);
			self.activecell = $('[data-cal-date]', cell).text();
			$('#cal-slide-tick').addClass('tick' + tick_position).show();
			slider.slideDown('fast', function() {
				$('body').one('click', function() {
					slider.slideUp('fast');
					self.activecell = 0;
				});
			});
		});

		// Wait 400ms before updating the modal & attach the mouseenter&mouseleave(400ms is the time for the slider to fade out and slide up)
		setTimeout(function() {
			$('a.event-item').mouseenter(function() {
				$('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-' + $(this).data('event-class'));
			});
			$('a.event-item').mouseleave(function() {
				$('div.cal-cell1').removeClass('day-highlight dh-' + $(this).data('event-class'));
			});
			self._update_modal();
		}, 400);
	}

	function getEasterDate(year, offsetDays) {
		var a = year % 19;
		var b = Math.floor(year / 100);
		var c = year % 100;
		var d = Math.floor(b / 4);
		var e = b % 4;
		var f = Math.floor((b + 8) / 25);
		var g = Math.floor((b - f + 1) / 3);
		var h = (19 * a + b - d - g + 15) % 30;
		var i = Math.floor(c / 4);
		var k = c % 4;
		var l = (32 + 2 * e + 2 * i - h - k) % 7;
		var m = Math.floor((a + 11 * h + 22 * l) / 451);
		var n0 = (h + l + 7 * m + 114)
		var n = Math.floor(n0 / 31) - 1;
		var p = n0 % 31 + 1;
		return new Date(year, n, p + (offsetDays ? offsetDays : 0), 0, 0, 0);
	}

	$.fn.calendar = function(params) {
		return new Calendar(params, this);
	}
}(jQuery));

function Calendar(calendarContainer){
	this.container = calendarContainer;
	
	var init_day;
	var init_view = "year";
	
	var date_regex = /\/cruises\/add\/from\-(\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]))\-to\-(\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]))$/;
	if (date_regex.test(window.location.href)) {
		init_day = date_regex.exec(window.location.href)[1];
		start_date = date_regex.exec(window.location.href)[1];
		end_date = date_regex.exec(window.location.href)[4];
		external_date = true;
		init_view = "month";
	}
	
	this.init = function() {
		this.calendar =	$(calendarContainer).find(".insert-calendar").calendar({
			events_source: "/calendar/",
			modal: "#events-modal",
			modal_type: "template",
			week_numbers_iso_8601: true,
			modal_title : function (event) { return event.title },
			view: init_view,
			day: init_day,
			first_day: "1",
			onAfterViewLoad: function(view) {
				$(calendarContainer).find('.dateLabel').text(this.getTitle());
				if (view == "year") {
					$(".cal-year-box .cal-cell").each(function(i) {
						var month = i + 1;
						var year = $("h3 .dateLabel").text();
						/* What we're doing is getting the date of the last day of the previous
						month by accessing the 0th of the next month. Feels hacky, but works well.
						e.g. the 0th day of August is July 31st, returning 31. */
						var month_day_count = (new Date(year, month, 0).getDate());
						if ($(this).find(".cal-data").data("availability") > month_day_count-1) {
							$(this).addClass("full");
							$(this).find(".cal-events-icon").html('<span class="label label-danger">Full</span>');
						} else if ($(this).find(".cal-data").data("availability") > 13) {
							$(this).addClass("almostFull");
							$(this).find(".cal-events-icon").html('<span class="label label-warning">Few days left</span>');
						} else if ($(this).find(".cal-data").data("availability") >= 0) {
							$(this).addClass("mostlyAvailable");
						}
						if ($(this).find(".cal-data").data("in-season")) {
							$(this).addClass("in-season");
						} else {
							$(this).addClass("not-in-season");
							$(this).find(".cal-events-icon").html('<span class="label label-warning">Season not active</span>');
						}
					});
				}
				if (view == "month") {
					$(calendarContainer).find('.cal-month-day .order-now').off("click");
					$(calendarContainer).find('.cal-month-day .order-now').click(function (event) {
						var clicked_date = $(this).closest(".cal-month-day").find("span").attr("data-cal-date");
						update_range(this, clicked_date);
						/*if($(this).closest(".cruiseDayForm").length) {
							event.stopPropagation();
							event.preventDefault();
							$(this).closest(".cruiseDayForm").find("[placeholder=Date]").val($(this).closest(".cal-month-day").find("span").attr("data-cal-date"));
						}*/
					});
					render_selected_dates($(calendarContainer).find('.cal-month-day'), selected_dates);
					$('.in-season.cal-day-weekend .order-now').tooltip(weekend_tooltip);
					if (document.querySelector(".add-event-button") || document.querySelector(".show-invoice-summary-button")) {
						$(".cal-month-day.not-in-season").addClass("cal-day-weekend").removeClass("not-in-season");
					}
				}
			},
			views: {
				year: {
					slide_events: 1,
					enable: 1
				},
				month: {
					slide_events: 1,
					enable: 1
				},
				week: {
					enable: 0
				},
				day: {
					enable: 0
				}
			}
		}); 
		
		var calendar = this.calendar;
		
		$(this.container).find('.calPreviousButton').off("click");
		$(this.container).find('.calPreviousButton').click(function () {
			calendar.navigate('prev');
			return false;
		});
		$(this.container).find('.calNextButton').off("click");
		$(this.container).find('.calNextButton').click(function () {
			calendar.navigate('next');
			return false;
		});
		$(this.container).find('.calTodayButton').off("click");
		$(this.container).find('.calTodayButton').click(function () {
			calendar.navigate('today');
			return false;
		});
		$(this.container).find('.calYearButton').off("click");
		$(this.container).find('.calYearButton').click(function () {
			calendar.view('year');
			return false;
		});
		$(this.container).find('.calMonthButton').off("click");
		$(this.container).find('.calMonthButton').click(function () {
			calendar.view('month');
			return false;
		});
		$(this.container).find('.calWeekButton').off("click");
		$(this.container).find('.calWeekButton').click(function () {
			calendar.view('week');
			return false;
		});
		$(this.container).find('.calDayButton').off("click");
		$(this.container).find('.calDayButton').click(function () {
			calendar.view('day');
			return false;
		});
	}
	
	this.init();
	
	$(".cruise-days-header").hide();
}