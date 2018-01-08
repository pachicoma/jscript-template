/**
 * filtre.js
 *
 * Copyright (c) 2018 pachicoma
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
//--------------------------------------------------
// DEFINE SCRIPT DESCRIPTION
//--------------------------------------------------
// Description Message
var DESCRIPT = "stdin text filter by regexp keyword."

// Rquire parameters
var REQUIRES = {
  "key": {
    descript: "filter keyword. you can use regexp pattern.",
    valid: ""
  }
}
// Optional parameters
var OPTIONS = {
  "sw": {
    descript: "case-insensitive. default case-sensitive.",
    valid: "^i?$",
    defaultValue: ""
  }
}

//--------------------------------------------------
// MAIN PROCCESS 
//--------------------------------------------------
function main(args) {
  var re = new RegExp(args["key"], args["sw"])
  while (hasNext()) {
    var line = readNextLine()
    if (re.test(line)) {
      writeNextLine(line)
    }
  }
}

//--------------------------------------------------
// USAGE
//--------------------------------------------------
// Print usage message
batFileName = WScript.ScriptName.slice(0, -3) + ".bat"
function printUsage() {
  WScript.Echo("DESCRIPT: " + DESCRIPT + "\n" +
               "USAGE: anycmd(output to stdout) | " + batFileName +
               makeParamList(REQUIRES, OPTIONS) + "\n" +
               makeParamDescript(REQUIRES, OPTIONS) + "\n")
}
// Make parameters text
function makeParamList(requires, options) {
  var params = ""
  for (var name in requires) {
    params += paramToString(name, requires, true)
  }
  for (var name in options) {
    params += paramToString(name, options, false)
  }
  return params
}
// Make parameters description message
function makeParamDescript(requires, options) {
  var params = ""
  for (var name in requires) {
    params += new Array("\n",
      paramToString(name, requires, true),
      requires[name].descript).join("\t")
  }
  for (var name in options) {
    params += new Array("\n",
      paramToString(name, options, false),
      options[name].descript).join("\t")
  }
  return params
}
// Convert param to string format
function paramToString(name, param, isRequire) {
    if (isRequire === true) {
        return new Array(" ", "/", name, ":<", param[name].valid, ">").join("")
    }
    else {
        return new Array(" ", "[/", name, ":<", param[name].valid, ">=\"", param[name].defaultValue, "\"]").join("")
    }
}

//--------------------------------------------------
// UTILITY FUNCTIONS
//--------------------------------------------------
// Get command line parameters
function packParams(requires, options) {
  var params = {}
  var args = WScript.Arguments.Named
  for (var key in requires) {
    if (args.Exists(key)) {
      params[key] = validParam(key, args(key), requires[key].valid)
    } else {
      throw new Error("/" + key + ": is require parameter")
    }
  }
  for (var key in options) {
    if (args.Exists(key)) {
      params[key] = validParam(key, args(key), options[key].valid)
    } else {
      params[key] = options[key].defaultValue
    }
  }
  return params
}
// Valid parameter
function validParam(key, value, pattern) {
  if (pattern !== "") {
    re = new RegExp(pattern, "g")
    if (!re.test(value)) {
      throw new Error("/" + key + ": '" + value + "' is ignore parameter. " +
                      "you must give next pattern <" + pattern + ">")
    }
  }
  // Skip valid or valid pattern
  return value
}

// Wrap I/O functions
function readNextLine() {
  return WScript.StdIn.ReadLine()
}
function hasNext() {
  return !WScript.StdIn.AtEndOfStream
}
function writeNextLine(str) {
  WScript.StdOut.WriteLine(str)
}
function writeNext(str) {
  WScript.StdOut.Write(str)
}
function writeLineToErr(str) {
  WScript.StdErr.WriteLine(str)
}
function writeToErr(str) {
  WScript.StdErr.Write(str)
}

//--------------------------------------------------
// EXECUTE MAIN PROC
//--------------------------------------------------
try {
  main(packParams(REQUIRES, OPTIONS))
} catch (e) {
  printUsage()
  e.description = "ERR(" + (e.number & 0xFFFF) + ") ... " + e.description
  throw e
}

