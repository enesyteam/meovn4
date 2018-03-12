(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.chotot||(g.chotot = {}));g=(g.validators||(g.validators = {}));g.phone = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var COUNTRY_CODE_REGEX, COUNTRY_PREFIXES, FAILURE_RETURN, FAILURE_RETURN_LENGTH, FAILURE_RETURN_MOBILE_PREFIX, FAILURE_RETURN_NON_DIGIT, FAILURE_RETURN_NUMBER_LENGTH, MAX_LENGTH, MIN_LENGTH, MOBILE_FOUR_DIGIT_PREFIXES, MOBILE_THREE_DIGIT_PREFIXES, NON_DIGIT_REGEX, PHONE_NUMBER_LENGTH, REDUDANT_CHARS, REDUDANT_REGEX,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

MIN_LENGTH = 10;

MAX_LENGTH = 14;

PHONE_NUMBER_LENGTH = 7;

COUNTRY_PREFIXES = ['0084', '084', '84'];

MOBILE_THREE_DIGIT_PREFIXES = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];

MOBILE_FOUR_DIGIT_PREFIXES = ['0120', '0121', '0122', '0123', '0124', '0125', '0126', '0127', '0128', '0129', '0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169', '0186', '0188', '0199'];

REDUDANT_CHARS = ['\\(', '\\)', '\\-', '\\.', '\\s', '\+'];

REDUDANT_REGEX = new RegExp("[" + (REDUDANT_CHARS.join('')) + "]", 'g');

NON_DIGIT_REGEX = /\D/;

COUNTRY_CODE_REGEX = new RegExp("^(" + (COUNTRY_PREFIXES.join('|')) + ")");

FAILURE_RETURN = false;

FAILURE_RETURN_LENGTH = 'ERR_LENGTH';

FAILURE_RETURN_NON_DIGIT = 'ERR_NON_DIGIT';

FAILURE_RETURN_MOBILE_PREFIX = 'ERR_PROVIDER';

FAILURE_RETURN_NUMBER_LENGTH = 'ERR_NUMBER_LENGTH';

module.exports = function(originalPhoneNumber, mobileOnly) {
  var length, mobilePrefixLength, phone, ref, ref1;
  if (mobileOnly == null) {
    mobileOnly = true;
  }
  phone = originalPhoneNumber;
  phone = phone.replace(REDUDANT_REGEX, '');
  length = phone.length;
  if (!((MIN_LENGTH <= length && length <= MAX_LENGTH))) {
    return FAILURE_RETURN_LENGTH;
  }
  if (NON_DIGIT_REGEX.test(phone)) {
    return FAILURE_RETURN_NON_DIGIT;
  }
  phone = phone.replace(COUNTRY_CODE_REGEX, '');
  if (phone[0] !== '0') {
    phone = '0' + phone;
  }
  length = phone.length;
  if (ref = phone.slice(0, 4), indexOf.call(MOBILE_FOUR_DIGIT_PREFIXES, ref) >= 0) {
    mobilePrefixLength = 4;
  } else if (ref1 = phone.slice(0, 3), indexOf.call(MOBILE_THREE_DIGIT_PREFIXES, ref1) >= 0) {
    mobilePrefixLength = 3;
  } else {
    mobilePrefixLength = 0;
  }
  if (mobilePrefixLength === 0) {
    return FAILURE_RETURN_MOBILE_PREFIX;
  }
  if (length - mobilePrefixLength !== PHONE_NUMBER_LENGTH) {
    return FAILURE_RETURN_NUMBER_LENGTH;
  }
  return phone;
};



},{}]},{},[1])(1)
});