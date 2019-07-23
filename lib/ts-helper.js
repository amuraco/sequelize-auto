// put in seperate file to keep main sequelize-auto clean
'use strict';

var Sequelize = require('sequelize');
var _ = Sequelize.Utils._;

function getModelFileStart(indentation, spaces, tableName) {
  var fileStart = "/* jshint indent: " + indentation + " */\n";
  fileStart += '// tslint:disable\n';
  fileStart += 'import { DataTypes, Model, Sequelize } from \'sequelize\';\n';
  return fileStart;
}

function generateTableModels(tableNames, isSpaces, indentation, isCamelCase, isCamelCaseForFile) {
  var spaces = '';
  for (var i = 0; i < indentation; ++i) {
    spaces += (isSpaces === true ? ' ' : "\t");
  }

  return generateImports() + generateTableMapper();

  function generateImports() {
    var fileTextOutput = '// tslint:disable\n';
    fileTextOutput += 'import * as path from \'path\';\n';
    fileTextOutput += 'import * as sequelize from \'sequelize\';\n';
    return fileTextOutput;
  }

  function generateTableMapper() {
    var fileTextOutput = 'export const initModels = function(seq:sequelize.Sequelize) {\n';
    for (var i = 0; i < tableNames.length; i++) {
      var tableForClass = isCamelCase ? _.camelCase(tableNames[i]) : tableNames[i];
      var tableForFile = isCamelCaseForFile ? _.camelCase(tableNames[i]) : tableNames[i];

      fileTextOutput += spaces + 'seq.import(path.join(__dirname, \'./' + tableForFile + '\'));\n';
    }
    fileTextOutput += '};\n';
    return fileTextOutput;
  }
}

exports.model = {
  getModelFileStart,
  generateTableModels
};

function getDefinitionFileStart() {
  return '// tslint:disable\n';
  //import * as Sequelize from \'sequelize\';\n\n';
}
function getDefinitionModel(tableName) {
  return `import { ${tableName} } from './${tableName}';\n`;
}

function getTableDefinition(seqTableDefAttr, tsTableDefAttr, tableName) {
  return `export class ${tableName} extends Model {${tsTableDefAttr}
}
export default function(sequelize:Sequelize) {
	return ${tableName}.init({
		${seqTableDefAttr}`;

}

// doing this in ts helper to not clutter up main index if statement
function getMemberDefinition(spaces, fieldName, val, allowNull) {
  if (fieldName === undefined) return '';
  var m = '\n' + spaces + 'public ' + fieldName + (allowNull === true ? '?:' : ':');

  if (val === undefined) {
    m += 'any';
  } else if (val.indexOf('DataTypes.BOOLEAN') > -1) {
    m += 'boolean';
  } else if (val.indexOf('DataTypes.INTEGER') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.BIGINT') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.STRING') > -1) {
    m += 'string';
  } else if (val.indexOf('DataTypes.CHAR') > -1) {
    m += 'string';
  } else if (val.indexOf('DataTypes.REAL') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.TEXT') > -1) {
    m += 'string';
  } else if (val.indexOf('DataTypes.DATE') > -1) {
    m += 'Date';
  } else if (val.indexOf('DataTypes.FLOAT') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.DECIMAL') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.DOUBLE') > -1) {
    m += 'number';
  } else if (val.indexOf('DataTypes.UUIDV4') > -1) {
    m += 'string';
  } else {  
    m += 'any';
  }

  return m + ';';
}

exports.def = {
  getDefinitionFileStart,
  getDefinitionModel,
  getTableDefinition,
  getMemberDefinition
};