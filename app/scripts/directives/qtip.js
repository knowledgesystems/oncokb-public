'use strict';

/**
 * @ngdoc directive
 * @name oncokbApp.directive:qtip
 * @description
 * # qtip
 */
angular.module('oncokbStaticApp')
  .directive('qtip', function(api) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var src = '';
        var hideEvent = 'mouseleave';
        var my = attrs.hasOwnProperty('my') ? attrs.my : 'center right';
        var at = attrs.hasOwnProperty('at') ? attrs.at : 'left center';
        var type = attrs.hasOwnProperty('qtipType') ? attrs.qtipType : '';
        var content = attrs.hasOwnProperty('qtipContent') ? attrs.qtipContent : '';

        // src = '<iframe width="610px" height="400px" src="http://www.ncbi.nlm.nih.gov/pubmed/' + attrs.number + '"></iframe>';
        // content = $(src);
        var options = {
          content: content,
          position: {
            my: my,
            at: at,
            viewport: $(window)
          },
          style: {
            classes: 'qtip-light qtip-rounded qtip-gene-evidence',
            'max-height': 300
          },
          show: 'mouseover',
          hide: {
            event: hideEvent,
            fixed: true,
            delay: 100
          }
        };

        if (type === 'geneEvidence') {
          options.content = '<img src="resources/images/loader.gif" />';
          options.events = {
            show: function(event, qtipApi) {
              api.getpumbedArticle(attrs.number).then(function(articles) {
                var articlesData = articles.data.result;
                var content = '';
                if (articlesData !== undefined && articlesData.uids.length > 0) {
                  content = '<ul class="list-group" style="margin-bottom: 5px">';

                  articlesData.uids.forEach(function(uid) {
                    var articleContent = articlesData[uid];
                    content += '<li class="list-group-item" style="width: 100%"><a href="http://www.ncbi.nlm.nih.gov/pubmed/' + uid + '" target="_blank"><b>' + articleContent.title + '</b></a>';
                    if (articleContent.authors !== undefined) {
                      content += '<br/><span>' + articleContent.authors[0].name + ' et al. ' + articleContent.source + '. ' + (new Date(articleContent.pubdate)).getFullYear() + '</span></li>';
                    }
                  });
                  content += "</ul>";
                }
                qtipApi.set({
                  'content.text': content,
                  'style.classes': 'qtip-light qtip-rounded gene-evidence-qtip'
                });

                qtipApi.reposition(event, false);
              });
            }
          };
        } else if (type === 'geneLevel') {
          options.content = '<img src="resources/images/loader.gif" />';
          options.events = {
            show: function(event, qtipApi) {
              var content = '';
              switch (attrs.number) {
                case '1':
                  content = '<span>FDA-approved biomarker and drug in this indication</span>';
                  break;
                case '2a':
                  content = '<span>Standard-of-care biomarker and drug in this indication but not FDA-approved*.</span>';
                  break;
                case '2b':
                  content = '<span>FDA-approved biomarker and drug in another indication, but not FDA or NCCN compendium-listed for this indication</span>';
                  break;
                case '3a':
                  content = '<span>Clinical evidence links biomarker to drug response in this indication but neither biomarker or drug are FDA-approved or NCCN compendium-listed</span>';
                  break;
                case '3b':
                  content = '<span>Clinical evidence links biomarker to drug response in another indication but neither biomarker or drug are FDA-approved or NCCN compendium-listed</span>';
                  break;
                case '4':
                  content = '<span>Preclinical evidence associates this biomarker to drug response, where the biomarker and drug are NOT FDA-approved or NCCN compendium-listed</span>';
                  break;

              }

              qtipApi.set({
                'content.text': content,
                'style.classes': 'qtip-light qtip-rounded'
              });

              qtipApi.reposition(event, false);
            }
          }
        }

        $(element).qtip(options);
      }
    };
  })
