# ng-files-model
----
Angular File Model is a directive for angularjs to help you make a model for input file and you can send it to sever for next step.

## Installation
### npm
`npm install ng-files-model --save`

## Model
Result or return are :
* lastModified : js millisecond date
* lastModifiedDate : js date
* name : file name
* size : file size
* type : file type
* data : data url base64 of the file

## Usage
on application :
`angular.module("myApp", ["ng-files-model"])`

on html :
`<input type="file" ng-files-model model="testFile" callback="function" data="data" multiple="mulplite" />`

Result :


    {
        "lastModified": 1475607121292,
        "lastModifiedDate": "2015-08-03T06:39:32.000Z",
        "name": "ng-files-model.txt",
        "size": 32,
        "type": "text/plain",
        "file": "VXBsb2FkIGZpbGVzIG1vZGVsIHdpdGggYW5ndWxhcgo="
    }
   


### Parâmetros

|parametro|tipo|descrição|obrigatório|padrão|
|:-------------|:----|:-----------|:-----------------|:----|
|callback|function|função executada após conversão dos arquivos|não| |
|data|object|Objeto enviado como segundo parãmetro na função callback|não| |
|multiple|tag|Tag html para multiplos arquivos|não| |
|model|array|object|Array ou objeto que recebe o resultado|não| |

Code inspired from https://github.com/mistralworks/ng-file-model

