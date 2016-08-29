var SocialShare = SocialShare || {};

$(document).ready(function() {
  'use strict';

  (function(app) {

    //siteUrl set to the applications root directory; modify for paths to assets as needed;
    var siteUrl = window.location.href;

    var shareServices = {
      'twitter': {
        shareurl: 'http://twitter.com/intent/tweet?',
        paramproto: {
          'text': 'text=', //Optional; Pre-populated UTF-8 and URL-encoded Tweet text.;
          'url': 'url=', //Optional; A fully-qualified URL with a HTTP or HTTPS scheme, URL-encoded.
          'hashtags': 'hashtags=', //Optional; comma-separated list of hashtag values without the preceding # character.
          'via': 'via=', //Optional; A Twitter username to associate with the Tweet
          'related': 'related=' //Optional; Suggest additional Twitter usernames related to the Tweet as comma-separated values...a URL-encoded comma and text after the username;
        }
      },
      'facebook': {
        shareurl: 'http://www.facebook.com/sharer.php?',
        paramproto: {
          'u': 'u='
        }
      },
      'linkedin': {
        shareurl: 'http://www.linkedin.com/shareArticle?',
        paramproto: {
          'url': 'url=', //Required; The url-encoded URL of the page that you wish to share.
          'mini': 'mini=', //Required; A required argument who"s value must always be:  true
          'title': 'title=', //Optional; The url-encoded title value that you wish you use.
          'summary': 'summary=', //Optional; The url-encoded description that you wish you use.
          'source': 'source=' //The url-encoded source of the content (e.g. your website or application name).
        }
      },
      'googleplus': {
        shareurl: 'https://plus.google.com/share?',
        paramproto: {
          'url': 'url=',
          'hl': 'hl=' //https://developers.google.com/+/web/share/#available-languages
        }
      }
    };

    function share(serviceName, paramOptions) {
      if (!shareServices[serviceName]) {
        throw new Error('Share service not defined');
      }
      var shareUrl = getShareUrl(serviceName, paramOptions);
      showPopup(shareUrl);
      return this;
    }

    function getShareUrl(name, options) {
      var shareAddress = shareServices[name].shareurl;
      var paramProto = shareServices[name].paramproto;
      options = options || {};


      //console.log(shareAddress, options.url, siteUrl, paramProto);

      //check for url param for all share services;
      if (name === 'facebook') {
        options.u ? (options.u = siteUrl + options.u) : (options.u = siteUrl);
      }
      else if (name === 'twitter') {
        //options.url ? (options.url = siteUrl + options.url) : (options.url = siteUrl);
      } else {
        options.url ? (options.url = siteUrl + options.url) : (options.url = siteUrl);
      }

      //check for linkedin requirements
      if (name === 'linkedin') {
        if (!options.mini || options.mini !== 'true') {
          options.mini = 'true';
        }
      }

      //get array of query params;
      var queryParams = getQueryStringArray(options, paramProto);

      //get complete share url
      var shareUrl = concatShareUrl(shareAddress, queryParams);
      return shareUrl;
    }

    function getQueryStringArray(options, paramProto) {
      var params = [];
      options = options || {};

      for (var param in options) {
        if (paramProto.hasOwnProperty(param)) {
          var queryStr = paramProto[param] + encodeURIComponent(options[param]);
          params.push(queryStr);
        }
      }
      return params;
    }

    function concatShareUrl(shareAddress, queryParams) {
      queryParams = queryParams || [];
      var shareUrl = queryParams.length ? (shareAddress + queryParams.join('&')) : shareAddress;
      return shareUrl;
    }

    function showPopup(shareUrl) {
      var width = 600;
      var height = 600;
      var top = ($(window).height() - height) / 2;
      var left = ($(window).width() - width) / 2;
      var windowFeatures = 'status=1' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
      var url = shareUrl;
      var windowName = '_blank';

      window.open(url, windowName, windowFeatures);

      return false;
    }

    (function init() {
      var shareServiceNames = Object.keys(shareServices);
      var prefix = 'share';
      //multiple class selector string
      var mcs = shareClasses(prefix, shareServiceNames)(true);
      //share classnames array
      var scn = shareClasses(prefix, shareServiceNames)(false);

      function shareClasses(classPrefix, classNames) {
        classNames = $.map(classNames, function(item, index) {
          return (classPrefix + '-' + item);
        });

        return function(classSelector) {
          if (classSelector) {
            var cs = $.map(classNames, function(item, index) {
              return ('.' + item);
            });
            return cs.join(', ');
          } else {
            return classNames;
          }
        };
      }

      $(mcs).on('click', initShare);

      function initShare(e) {
        //set parameter options
        var attrs = Array.prototype.slice.call($(this)[0].attributes);
        var paramOptions = {};

        $.each(attrs, function(index, item) {
          var attrName = item.name;
          var attrValue = item.value;

          if ((attrName.indexOf(prefix + '-') === 0) || (attrName.indexOf('data-' + prefix + '-') === 0)) {
            var param = attrName.split(prefix + '-')[1];
            paramOptions[param] = attrValue;
          }
        });

        //set social service type
        function hasClass(className) {
          return $(this).hasClass(className);
        }

        var hasShareService = scn.filter(hasClass.bind(this));

        //should only have one share service
        if (hasShareService.length === 1) {
          var shareServiceName = hasShareService[0].split('-')[1];
          share(shareServiceName, paramOptions);
        }
      }
    })();

    var api = {
      share: share
    };

    //extend api methods
    app = $.extend(app, api);
    return app;

  })(SocialShare);
});
