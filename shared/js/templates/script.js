angular.module('buildApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('buildItem/html/default.tmpl',
    "<div ng-class=\"{loading: itemType.status === 'pending'}\" class=\"grid table-row {{itemType.status}}-theme\"><div class=\"table-col col-1-5\"><a href=# title=Tenrox-R1_1235 class=process-btn ng-click=displayResults(itemType);><span class=icon-{{itemType.type}}></span><span class=process-name>{{itemType.id}}</span></a></div><div class=\"table-col col-1-10\"><a href=# title=owner>{{itemType.owner || '-'}}</a></div><div class=\"table-col col-1-5\">{{itemType.timeStarted || '-'}}</div><div class=\"table-col col-1-10\">{{itemType.status || '-'}}</div><loader item-jobs=itemType.jobs.metrics></loader><loader item-jobs=itemType.jobs.build></loader><loader item-jobs=itemType.jobs.unitTest></loader><loader item-jobs=itemType.jobs.functionalTest></loader><item-details item-data=itemType></item-details></div>"
  );


  $templateCache.put('buildList/html/default.tmpl',
    "<section class=table-container><header class=\"grid table-header\"><span class=\"table-col col-1-5\">Changelist/Build</span> <span class=\"table-col col-1-10\">Owner</span> <span class=\"table-col col-1-5\">Time Started</span> <span class=\"table-col col-1-10\">State</span> <span class=\"table-col col-1-10\">Metrics</span> <span class=\"table-col col-1-10\">Build</span> <span class=\"table-col col-1-10\">Unit Test</span> <span class=\"table-col col-1-10\">Functional Test</span></header><build-item ng-repeat-start=\"build in buildList\" item-type=build on-expand=displayResults ng-model=buildList></build-item><build-item ng-repeat-end ng-repeat=\"firewall in build.firewalls\" item-type=firewall on-expand=displayResults ng-model=buildList></build-item></section>"
  );


  $templateCache.put('itemDetails/html/default.tmpl',
    "<div ng-class=\"{hidden: !itemData.expanded}\" class=\"col results\"><div class=\"col-1-5 metrics\"><div class=fail><div class=\"result-box red\">{{itemData.results.metrics.text}}</div></div></div><div class=\"col-1-5 build\"><div class=success><div class=\"result-box green\">{{itemData.results.build.text}}</div></div></div><div class=\"col-1-5 unit-test\"><div class=success><div class=\"result-box green\">{{itemData.results.unitTest.text}}</div></div></div><div class=\"col-1-5 functional-test\"><div class=success><div class=\"result-box green\">{{itemData.results.functionalTest.text}}</div></div></div><div class=\"col-1-5 conclusion\"><div class=success><div class=\"result-box green\">box</div></div></div></div>"
  );


  $templateCache.put('loader/html/default.tmpl',
    "<div class=\"table-col col-1-10\"><span class=\"loading-box {{itemJobs.status}}\"><span ng-style=\"{width: itemJobs.percentage + '%'}\"></span></span></div>"
  );


  $templateCache.put('modal/html/default.tmpl',
    "<div ng-class=\"{opened: modalOpened}\" class=modal-wrapper><div class=modal-content><p>{{textMessage}}</p><div class=button><a ng-click=closeModal()>OK</a></div></div></div>"
  );

}]);
