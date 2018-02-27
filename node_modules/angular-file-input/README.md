### angular-file-input
Angular directive to allow ng-model to be used in file inputs

## Installation

##### Install with npm

```
npm i angular-file-input --save
```

##### Add the scripts to your HTML

```
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-file-input/dist/angular-file-input.js"></script>
````

##### Import in your module definition

```js
angular.module('app', ['angular-file-input']);
```

And you're done :)

## How to use

Create a file input and add the ng-model attribute to it
```html
<input type="file" ng-model="file">
```
"file" will be the selected [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object.

You can also use the `multiple` attribute
```html
<input type="file" ng-model="files" multiple>
```
In this case, files will be an (native) array of Files.

## Development
1. Clone/fork repository
2. npm install
3. Make your changes in /lib
4. gulp
5. A regular version and a minified version will be in dist
6. PR your changes :)
