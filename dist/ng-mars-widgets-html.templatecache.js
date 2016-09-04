angular.module('form.widgets').run(['$templateCache', function($templateCache) {$templateCache.put('directives/partials/date.input.html','<div class="form-group"><label class="capitalize" for="id_{{ dateInput.name }}">{{ dateInput.caption }}<span ng-show="!dateInput.blank">&nbsp;*</span></label><div class="input-group" ng-class="dateInput.getClass(form[dateInput.name], [\'date\'])"><input class="form-control" name="{{ dateInput.name }}" type="text" uib-datepicker-popup="dd/MM/yyyy" ng-model="dateInput.content" is-open="dateInput._opened" min-date="dateInput.minDate()" show-button-bar="false" ng-required="!dateInput.blank"><span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="dateInput.openDatepicker($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></div><span class="text-muted">{{ dateInput.helpText }}</span></div>');
$templateCache.put('directives/partials/image.input.html','<div class="form-group"><label class="capitalize" for="id_image">{{ imageInput.caption }}<span ng-show="!imageInput.blank">&nbsp;*</span></label><div class="media" ng-class="{\'\': !form[imageInput.name].$error, \'has-errrror\': (form[imageInput.name].$touched &amp;&amp; (form[imageInput.name].$error.valid || form[imageInput.name].$error.blank))}"><div class="media-body"><img ng-if="imageInput.imageThumbnail &amp;&amp; !imageInput.theImageContent.b64string" ng-src="{{imageInput.imageThumbnail}}" width="100" height="auto"><img ng-if="imageInput.theImageContent.b64string" width="100" height="auto" ng-src="data:image/{{imageInput.theImageContent.content_type}};base64, {{imageInput.theImageContent.b64string}}"></div><div class="media-rigth"><p class="media-heading btn btn-default btn-file pull-right">{{ imageInput.browseText }}<input class="form-control" id="id_image" name="{{ imageInput.name }}" type="file" accept="image/*" file-on-change="imageInput.uploadMe(files)" ng-model="img" ng-required="!imageInput.blank"></p></div></div><div ng-messages="form.image.$error"><div ng-message="required" ng-if="form[imageInput.name].$error">{{ form.image.$error.message }}</div></div><span class="text-muted">{{ imageInput.helpText }}</span></div>');
$templateCache.put('directives/partials/mars.filter.html','<form role="form"><div class="form-group"><div class="input-group"><input class="form-control" type="text" ng-model="mars.search" placeholder="{{ mars.placeholder }}"><span class="input-group-btn"><button class="btn btn-primary" type="submit">{{ mars.action }}</button></span></div></div></form>');
$templateCache.put('directives/partials/related.input.html','<div class="form-group" ng-class="related.getCSSClass(related.form.content_type)"><label class="capitalize" for="id_{{ related.name }}">{{ related.caption }}<span ng-show="!related.blank">&nbsp;*</span></label><select class="form-control" ng-if="!related.multiple" id="id_{{related.name }}" name="{{ related.name }}" ng-model="related.content" ng-required="!related.blank"><option ng-repeat="item in related.objects" value="{{ item.resource_uri }}">{{ item.name }} ({{ item.slug }})</option></select><div class="row form-inline center-content" ng-if="related.multiple"><div class="col-xs-5 form-group"><select class="form-control" multiple="multiple" id="id_{{related.name }}_master" style="width: 100%" scrolly="scrolly" load-more="related.loadMore()" name="{{ related.name }}_master" ng-model="related.master" ng-options="item.resource_uri as item.name for item in related.objects | cleanObjects: related.content : related.idField | orderBy: [&quot;app_label&quot;]"></select></div><div class="col-xs-1"><button class="btn btn-link glyphicon glyphicon-circle-arrow-right" ng-disabled="related.rightDisabled" style="transform:scale(1.7,1.7)"></button><br><br><button class="btn btn-link glyphicon glyphicon-circle-arrow-left" ng-disabled="related.leftDisabled" style="transform:scale(1.7,1.7)"></button></div><div class="col-xs-5 form-group"><select class="form-control" multiple="multiple" id="id_{{related.name }}" style="width: 100%" name="{{ related.name }}" ng-model="related.fakeContent" ng-required="!related.blank" ng-options="item.resource_uri as item.name for item in related.content | cleanObjects: related.objects : related.idField | orderBy: [&quot;app_label&quot;]"></select></div></div><span class="text-muted">{{ related.helpText }}</span></div>');
$templateCache.put('directives/partials/tags.input.html','<div class="form-group"><label class="capitalize" for="id_topics">{{ tags.caption }}<span ng-show="tags.blank">&nbsp;*</span></label><tags-input ng-model="tags.tagsModel" placeholder="{{ tags.placeholder }}" display-property="{{ tags.displayProperty }}" replace-spaces-with-dashes="false"><auto-complete source="tags.loadTags($query)"></auto-complete></tags-input></div>');
$templateCache.put('directives/partials/text.input.html','<div class="form-group" ng-class="textInput.getClass(form[textInput.name], [\'maxlength\'])"><label class="capitalize" for="id_{{ textInput.name }}">{{ textInput.caption }}<span ng-show="!textInput.blank">&nbsp;*</span></label><div ng-if="textInput.textArea"><textarea class="form-control" name="{{ textInput.name }}" id="id_{{ textInput.name }}" ng-model="textInput.content" ng-required="!textInput.blank" ng-maxlength="textInput.maxLength" pattern="{{ textInput.regexValidator }}"></textarea></div><div ng-if="!textInput.textArea &amp;&amp; textInput.type !== &quot;number&quot;"><input class="form-control" name="{{ textInput.name }}" id="id_{{ textInput.name }}" type="{{ textInput.type }}" ng-model="textInput.content" ng-required="!textInput.blank" ng-maxlength="textInput.maxLength" pattern="{{ textInput.regexValidator }}"></div><div ng-if="textInput.type === &quot;number&quot;"><input class="form-control" name="{{ textInput.name }}" id="id_{{ textInput.name }}" type="number" ng-model="textInput.content" min="0" ng-max="{{ textInput.maxLength }}" pattern="{{ textInput.regexValidator }}" ng-required="textInput.requires || !textInput.blank"></div><span class="text-muted">{{ textInput.helpText }}</span></div>');}]);